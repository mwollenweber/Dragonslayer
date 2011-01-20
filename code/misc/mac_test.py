#!/usr/bin/python
import os, sys, dragonslayer


x = dragonslayer.dragonslayer()
x.load_mac(mac_file="./mac_file.csv")
x.shutdown()
