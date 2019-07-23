from headers import H

def check(sum):
    return (256 - sum) % 256

def msg(payload):
    sum = 0
    for i in payload:
        print("%02x" %(i), end=' ')
        sum += i
    print("%02x" %(check(sum)))


def cctForm(dest, cmd, data=[], source = 1):

    payload = [dest, len(data), source, cmd, *data]
    msg(payload)

def main():
    cctForm(0,H['simple_poll'], source = 0x01)

if (__name__ == "__main__"):
    main()
