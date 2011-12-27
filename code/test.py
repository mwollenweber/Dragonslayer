#!/usr/bin/python
import dragonslayer

x = dragonslayer.dragonslayer()
x.update_mdl()
#x.update_shadow()
x.load_dragon_events()
#x.update_patchy()
x.generate_hourly_bad()
x.shutdown()
