def category_to_text(cat):
	data = ''
	if cat == 200:
		data = "Normal"
	elif cat == 201:
		data = "Normal - Remedied"
	elif cat == 20:
		data = "Student"
	elif cat == 300:
		data = "Server"
	elif cat == 42:
		data = "Needs Research"
	elif cat == 100:
		data = "Other - Do Not Ticket"
	elif cat == 252:
		data = "Other - Please Review"
	elif cat == 250:
		data = "VIP - Please Review"
	elif cat == 251:
		data = "VIP - Block/Re-image"	
	elif cat == 253:
		data = "Request Review"
	elif cat == 500:
		data = "Needs Forensics"
	elif cat == 510:
		data = "Forensics Ongoing"
	elif cat == 520:
		data = "Forensics Complete"
	elif cat == 0:
		data = "Delete"
	elif cat == 25:
		data = "Mail Compromise - Student"
	elif cat == 205:
		data = "Mail Compromise - Faculty/Staff"
	else:
		data = "Unknown"

	return data
