from headers import H

def simpleChsum(payload):
    sum = 0
    for i in payload:
        sum += i

    checksum = -sum % 0x100
    print(FMT % checksum)

def crc16ccitt(crc, data):
    # taken from:
    # https://stackoverflow.com/questions/25239423/crc-ccitt-16-bit-python-manual-calculation
    # consistent with results from:
    # https://www.lammertbies.nl/comm/info/crc-calculation.html
    msb = crc >> 8
    lsb = crc & 255
    for c in data:
        x = c ^ msb
        x ^= (x >> 4)
        msb = (lsb ^ (x >> 3) ^ (x << 4)) & 255
        lsb = (x ^ (x << 5)) & 255
    checksum = (msb << 8) + lsb
    
    print(FMT % (checksum))

def msg(payload):
    check = simpleChsum
    for i in payload:
        print(FMT %(i), end=' ')

def cctForm(dest, cmd, data=[], source = 1):
    return [dest, len(data), source, cmd, *data]

def main():
    check = simpleChsum
    payload = cctForm(2,H['simple_poll'], source = 0x01)
    # payload = cctForm(2,242, source = 0x01)
    # payload= [76, 97, 109, 109, 101, 114, 116]
    msg(payload)
    simpleChsum(payload)

    # crc = 0x1021
    # crc = 0x1d0f
    # crc16ccitt(crc, payload)

if (__name__ == "__main__"):
    FMT="%02x"
    # FMT="%d"
    main()
