/* NwSDKTest.c : Sample application using the NetWitness SDK
 */
#ifdef _WINDOWS
#define WIN32_LEAN_AND_MEAN     /* Exclude rarely-used stuff from Windows headers */
#include <stdio.h>
#include <tchar.h>
#include <winsock2.h>
#else
#include <stdio.h>
#include <string.h>
#endif

#include <nw/NwSDK.h>

#define SUCCESS 1
#define FAILURE 0

/* check error status   */
void check(nwint32 result, nwint32 handle)
{
    char     error[256];
    nwuint32 code = 0;
	
    strcpy(error, "ok");
	
    if (result == FAILURE)
    {
        NwLastError(handle, &code, error, 256);
    }
	
    printf(" - handle: %i result: %i code: %u message: %s\n", handle, result, code, error);
}


void printField(struct NwField *field)
{
    char            name[17];
    char            value[257];
	
    /* clear name and value fields */
    memset(name, 0, sizeof name);
    memset(value, 0, sizeof value);
	
    /* copy the name of the field into a safe buffer for printing */
    strncpy(name, field->type.name, 16);
	
    /* convert the variant value to a string */
    NwToString(&field->variant,value,256);
	
    /* check if id1 and id2 are same */
    if (field->id1 == field->id2)
    {
        /* output field range to screen */
#if (__SIZEOF_LONG__  == 8)
		printf("id=%-5lu  session=%-5lu  %16s=%s",
			   field->id1, field->group, name, value);
#else
		printf("id=%-5llu  session=%-5llu  %16s=%s",
			   field->id1, field->group, name, value);
#endif
		
    }
    else
    {
        /* output field range to screen */
#if (__SIZEOF_LONG__  == 8)
		printf("ids=%-5lu - %-5lu  session=%-5lu  %16s=%s",
			   field->id1, field->id2, field->group, name, value);
#else
		printf("ids=%-5llu - %-5llu  session=%-5llu  %16s=%s",
			   field->id1, field->id2, field->group, name, value);
#endif
    }
	
    /* if we have a count print that */
    if (field->count)
    {
#if (__SIZEOF_LONG__  == 8)
		printf("  count:%lu", field->count);
#else
		printf("  count:%llu", field->count);
#endif
    }
	
    /* new line */
    printf("\n");
}


void dbOpen(const char * url, nwuint32 * handle)
{
    nwuint32 result     = FAILURE;
	
    printf("\nNwOpen(%s)", url);
	
    result = NwOpen(url, handle, NULL, NULL, NULL);
	
    /* output any error info */
    check(result, *handle);
}

void dbOpenRemote(nwuint32 existingHandle, const char * url, nwuint32 * handle)
{
    nwuint32 result     = FAILURE;
	
    printf("\nNwOpen(%s)", url);
	
    result = NwOpenRemote(existingHandle, url, handle, NULL, NULL, NULL);
	
    /* output any error info */
    check(result, *handle);
}

void dbClose(nwuint32 * handle)
{
    nwuint32 result = FAILURE;
	
    printf("\nNwClose(%u)", *handle);
	
    result = NwClose(*handle);
	
    /* output any error info */
    check(result, *handle);
}

void dbInfo(nwuint32 handle, nwuint32 verbose)
{
    char        info[1024]  = {'\0'}; /* information string */
    nwuint32    infoSize    = 1024;   /* information string size */
    nwuint64    session1    = 0;      /* starting session number */
    nwuint64    session2    = 0;      /* last session number */
    nwuint64    field1      = 0;      /* starting field number */
    nwuint64    field2      = 0;      /* last field number */
    nwuint32    result      = FAILURE;
    nwuint64    i           = 0;
    nwuint64    total       = 0;
	
    printf("\nNwInfo(%u)", handle);
    result = NwInfo(handle, NW_INFO_FLAG_DEFAULT, info, infoSize);
    printf(" info=[%s]\n", info);
    
    printf("\nNwSession(%u)", handle);
    result = NwSession(handle, &session1, &session2, &field1, &field2);
#if __SIZEOF_LONG__ == 8
    printf(" session1=%lu session2=%lu field1=%lu field2=%lu\n", session1, session2, field1, field2);
#else
    printf(" session1=%llu session2=%llu field1=%llu field2=%llu\n", session1, session2, field1, field2);
#endif
	
    if (verbose)
    {
        for (i = session1; i <= session2; ++i)
        {
            result = NwSession(handle, &i, &i, &field1, &field2);
            if (result == FAILURE) break;
			
            total = 0;
            if (field1 > 0 && field2 > 0) total = field2 - field1 + 1;
#if __SIZEOF_LONG__ == 8
            printf(" - session %lu has %lu fields of range %lu-%lu\n", i, total, field1, field2);
#else
            printf(" - session %llu has %llu fields of range %llu-%llu\n", i, total, field1, field2);
#endif
        }
    }
	
    /* output any error info */
    check(result, handle);
}


void dbLanguage(nwuint32 handle)
{
    /* setup local variables */
    nwuint64        lang1   = 0;
    nwuint64        lang2   = 0;
    nwuint32        result  = FAILURE;
    nwuint32        size    = 10;
    struct NwField  fields[10];
    nwuint32        i;
    char            name[17];
	
    printf("\n\nDumping Language Fields\n");
	
    /* query all records paging 10 at a time */
    while (lang1 <= lang2
           && (result = NwLanguage(handle, &lang1, &lang2, 0 /* time1 */, 0 /* time2 */, 0 /* reserved */, NW_LANGUAGE_FLAG_DEFAULT, fields, &size))
           && size > 0)
    {
        /* dump all received fields */
        for (i = 0; i < size; ++i)
        {
            const struct NwField *f = &fields[i];
            /* copy the name of the field into a safe buffer for printing */
            strncpy(name, f->type.name, 16);
			
            /* print results to screen */
#if __SIZEOF_LONG__ == 8
            printf("id=%2lu  name=%16s  format=%3u  flags=%u  range=%lu-%lu  count=%lu\n", f->group, name, f->variant.format, f->flags, f->id1, f->id2, f->count);
#else
            printf("id=%2llu  name=%16s  format=%3u  flags=%u  range=%llu-%llu  count=%llu\n", f->group, name, f->variant.format, f->flags, f->id1, f->id2, f->count);
#endif
        }
    }
	
    /* output any error info */
    check(result, handle);
}

void dbIntegrity(nwuint32 handle)
{
    nwuint64        field1 = 0;
    nwuint64        field2 = 0;
    nwuint32        size = 1;
    struct NwField  currentField, lastField;
    nwuint32        result = FAILURE;
	
    memset(&currentField,0, sizeof(currentField));
    memset(&lastField,0, sizeof(currentField));
	
    printf("\nRunning Database Integrity Check\n");
    /* query all records paging 100 at a time */
    while (field1 <= field2
           && (result = NwQuery(handle, &field1, &field2, "", &currentField, &size, NULL, NULL))
           && size > 0)
    {
        if ((lastField.id1 > 0 && lastField.id1 + 1 != currentField.id2))
        {
            printf("ORDER ERROR:\n");
            printField(&lastField);
            printField(&currentField);
        }
        lastField = currentField;
    }
	
    /* output any error info */
    check(result, handle);
}

void dbDump(nwuint32 handle)
{
    /* setup local variables */
    nwuint64        field1 = 0;
    nwuint64        field2 = 0;
    nwuint32        size = 100;
    struct NwField  fields[100];
    nwuint32        result = FAILURE;
    unsigned int    i;
	
    printf("\n\nDumping All Field Records\n");
	
    /* query all records paging 100 at a time */
    while (field1 <= field2
           && (result = NwQuery(handle, &field1, &field2, "", fields, &size, NULL, NULL))
           && size > 0)
    {
        /* dump all received fields */
        for (i = 0; i < size; ++i)
        {
            printField(&fields[i]);
        }
    }
	
    /* output any error info */
    check(result, handle);
}


/* get top 10 sessions counts of a specified field */
void dbValues(nwuint32 handle, const char* field)
{
    /* setup local variables */
    nwuint64        field1 = 0;
    nwuint64        field2 = 0;
    nwuint32        size = 10;
    struct NwField  fields[10];
    nwuint32        result = FAILURE;
    unsigned int    i;
    char            name[17];
    char            value[257];
	
    /* clear name and value fields */
    memset(name, 0, sizeof name);
    memset(value, 0, sizeof value);
	
    printf("\nTop 10 Values for %s\n",field);
	
    /* retrieve the top 10 report */
    if ((result = NwValues(handle, field1, field2, field, "", 
						   NW_VALUES_FLAG_TOTAL_SESSIONS | 
						   NW_VALUES_FLAG_SORT_TOTAL |
						   NW_VALUES_FLAG_ORDER_DESCENDING,
						   0,
						   fields, &size,
						   NULL, NULL))
        && size > 0)
    {
        /* cycle through all returned results */
        for (i = 0; i < size; ++i)
        {
            /* print results to screen */
            printField(&fields[i]);
        }
    }
	
    /* output any error info */
    check(result, handle);
}

void dbSearch(nwuint32 handle)
{
    /* setup local variables */
    nwuint64        field1 = 0;
    nwuint64        field2 = 0;
    nwuint32        size = 100;
    struct NwField  fields[100];
    nwuint32        result = FAILURE;
    unsigned int    i;
	
    printf("\nPerforming Content search on Web Traffic on sessions:\n");
	
    /* query all web records paging 100 at a time */
    while (field1 <= field2
           && (result = NwQuery(handle, &field1, &field2, 
								"select sessionid where service=80",
								fields, &size, NULL, NULL))
           && size > 0)
    {       
        /* cycle through all returned sessions */
        for (i = 0; i < size; ++i)
        {            
            struct NwField  search;
            nwuint32        searchsize = 1;
            nwuint64 sessionid = fields[i].variant.value.uint64;
#if __SIZEOF_LONG__ == 8
            printf(" %lu", sessionid);
#else
            printf(" %llu", sessionid);
#endif
			
            /* perform search over packets (sp) for keyword 'post' and case insensitive (ci) */
            if ((result = NwSearch(handle, sessionid, 
								   "select hit where keyword='post' sp ci", &search, &searchsize))
                && searchsize > 0)
            {
                nwuint32 rendertype = 0;
                const char* filename = "c:\\Temp\\hit.html";
				
                printf("\nContent Search Hit Found:\n");
                /* print the hit we have found */
                printField(&search);
				
                /* auto display content to hit.html and exit */             
                result = NwContent(handle, sessionid,
								   &rendertype, 0, 0, NULL,
								   filename);
                
                printf("Rendered Session to %s\n", filename);
            }
            /* check if we should stop searching because of
			 failure or hit found */
            if (result == FAILURE || searchsize > 0)
            {
                field1 = field2+1;
                break;
            }
        }
    }
    /* output any error info */
    check(result, handle);
}

void extractVoip(nwuint32 handle)
{
    nwuint64        field1 = 0;
    nwuint64        field2 = 0;
    struct NwField  field;
    nwuint32        result = FAILURE;   
    nwuint32        size = 1;       
	
    printf("\n\nDumping All VoIP Traffic\n");
	
    /* query all records paging 100 at a time */
    while (field1 <= field2
           && (result = NwQuery(handle, &field1, &field2, "select sessionid where service=1720", &field, &size, NULL, NULL))
           && size > 0)
    {
        /* create filename as sessionid.html w/ voip wav files */
        char filename[256];
        nwuint32 rendertype;        
        rendertype = NW_CONTENT_TYPE_VOIP;      
#if __SIZEOF_LONG__ == 8
        sprintf(filename,"c:\\voip\\%lu.html",field.group); 
#else
        sprintf(filename,"c:\\voip\\%llu.html",field.group); 
#endif
		
        /* render as VOIP to directory */
        result = NwContent(handle, field.group,
						   &rendertype, 0, 0, NULL,
						   filename);
    }
	
    /* output any error info */
    check(result, handle);
}


void adminCreatePipe(nwuint32 handle, const char * path, nwuint32 * pipeHandle)
{
    nwuint32 result     = FAILURE;
	
    printf("\nNwCreatePipeByPath(%d)", handle);
	
    result = NwCreatePipeByPath(handle, path, pipeHandle);
	
    /* output any error info */
    check(result, *pipeHandle);
}

void adminSendMessage(nwuint32 pipeHandle, const char * message, const char * params)
{
    nwuint32 result     = FAILURE;
	
    printf("\nNwSendMessage(%d)", pipeHandle);
	
    result = NwSendMessage(pipeHandle, message, params);
	
    /* output any error info */
    check(result, pipeHandle);
}

void adminWait(nwuint32 pipeHandle, nwuint32 seconds)
{
    nwuint32 result     = FAILURE;
	
    printf("\nNwWait(%d)", pipeHandle);
	
    result = NwWait(pipeHandle, seconds);
	
    /* output any error info */
    check(result, pipeHandle);
}

void adminOutput(nwuint32 pipeHandle)
{
    nwuint32 result     = FAILURE;
    nwuint32 count      = 0;
    nwuint32 index      = 0;
    nwint32  size       = 0;
    nwuint32 i          = 0;
    char     data[1024];
    nwuint32 pos = 0;
    char     name[64];
    char     value[64];
    nwint32  nameSize = sizeof(name);
    nwint32  valueSize = sizeof(value);
	
	
    printf("\nNwResponseCount(%d)", pipeHandle);
	
    result = NwResponseCount(pipeHandle, &count);
    check(result, pipeHandle);
	
    for (i = 0; i < count; ++i)
    {
        do
        {
            size = sizeof(data);
            result = NwResponseData(pipeHandle, index++, data, &size);
            check(result, pipeHandle);
			
            if (size > 0)
            {
                printf("\nNwResponseData: %s\n", data);
				
                /* Test our helper functions */
                /*
				 while (nameSize > 0)
				 {
				 nameSize  = sizeof(name) - 1;
				 valueSize = sizeof(value) - 1;
				 NwGetNameValue(data, pos++, name, &nameSize, value, &valueSize);
				 
				 // always put NULL at end
				 name[sizeof(name) - 1] = '\0';
				 value[sizeof(value) - 1] = '\0';
				 
				 if (nameSize > 0)
				 {
				 printf("Helper Parser: %s = %s\n", name, value);
				 }
				 
				 // Now test getting a value for a name by lookup
				 valueSize = sizeof(value) - 1;
				 NwGetValue(data, name, value, &valueSize);
				 value[sizeof(value) - 1] = '\0';
				 if (valueSize > 0)
				 {
				 printf("Helper Direct Lookup: %s = %s\n", name, value);
				 }
				 
				 // Try a bogus name
				 valueSize = sizeof(value) - 1;
				 NwGetValue(data, "bogus", value, &valueSize);
				 value[sizeof(value) - 1] = '\0';
				 if (valueSize > 0)
				 {
				 printf("Helper Bogus Lookup: %s = %s\n", name, value);
				 }
				 else
				 {
				 printf("No value found for bogus (that's good)\n");
				 }
				 }
				 */
            }
			
			
        } while (size > 0);
        result = NwPopFrontResponse(pipeHandle);
        check(result, pipeHandle);
    }
}

void adminResponseHandler(nwuint32 collectionHandle, nwuint32 pipeHandle, void * userData)
{
    printf("\nadminResponseHandler(%d)", pipeHandle);
	
    adminOutput(pipeHandle);
}


int main(int argc, char* argv[])
{
    /* globals for collection */
    nwuint32 handle     = 0;  /* current handle */
    nwuint32 pipeHandle = 0;  /* pipe handle */
    nwuint32 verbose    = 0; /* enable for more details */
    nwuint32 result     = 0; /* enable for more details */
	
    if (argc < 2)
    {
        printf("Specify the URL to open such as:\n");
        printf("  file:///D:/NetWitness/Collection\n");
        printf("  nw://nwupdate:NWupdate4321@192.168.0.1\n");
        printf("  nws://admin:password@recorder.local\n");
		
        return 0;
    }   
	
    /* open the collection */
    dbOpen(argv[1], &handle);
	
    adminCreatePipe(handle, "/", &pipeHandle);
    
    adminSendMessage(pipeHandle, "ls", NULL);
    adminWait(pipeHandle, 10);  /* wait 10 seconds for ls response to arrive */
    adminOutput(pipeHandle);
	
    /* now test response handler, which will be called when a response arrives
	 */
    result = NwPipeResponseHandler(pipeHandle, &adminResponseHandler, NULL);
    check(result, pipeHandle);
	
    /* Now send info command to our pipe and let the handler output the results .
	 This is asynchronous and the thread will continue on without waiting for
	 the result.  Care must be taken to avoid threading issues.
	 */
    adminSendMessage(pipeHandle, "info", NULL);
	
    if (argc > 2)
    {
        /* This is a test that can open a remote server using an existing connection */
        /* The syntax is nearly the same, but the remote server name must exist under
		 the /services node of the existing server connection and that service
		 state must be open (/services/<service>/stats/state = open)
		 */
        nwuint32 remoteHandle     = 0;
        nwuint32 remotePipeHandle = 0;
		
        dbOpenRemote(handle, argv[2], &remoteHandle);
		
        adminCreatePipe(remoteHandle, "/sys/config", &remotePipeHandle);
        adminSendMessage(remotePipeHandle, "ls", NULL);
        adminWait(remotePipeHandle, 10);  /* wait 10 seconds for ls response to arrive */
        adminOutput(remotePipeHandle);
        dbClose(&remotePipeHandle);
        dbClose(&remoteHandle);
    }
	
    /* get collection information */
    //dbInfo(handle, verbose);
	
    /* get the language tokens */
    //dbLanguage(handle);
	
    /* do an integrity check of ids */
    //if (verbose) dbIntegrity(handle);
	
    /* perform full database field dump */
    //if (verbose) dbDump(handle);
	
    /* perform top 10 values for usernames */
    //dbValues(handle, "username");
	
    /* perform content search */
    //dbSearch(handle);
	
    /* close the pipe and collection */
    dbClose(&pipeHandle);
    dbClose(&handle);
	
    return 0;
}
