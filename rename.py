import sys
import os

for file in sys.argv:
    if (file[-3:] == '.js'):
        newfile = file[:-3] + '.ts'
        os.system(f'git mv {file} {newfile}')
