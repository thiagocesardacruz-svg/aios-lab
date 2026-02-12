@echo off
:: Quick alias for activity logging
:: Usage: alog "message" [--type=TYPE] [--files=a,b]
node "%~dp0log.mjs" %*
