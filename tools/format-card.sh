#!/bin/sh
# Wipe the 256 GB storage card and format the whole card as one ext4 partition labelled SERVER.
# Uses an MBR partition table because this board's kernel cannot read GPT.

# find the ~256 GB USB disk (refuse anything else)
DEV=""
for b in /sys/block/sd*; do
	GB=$(( $(cat $b/size) / 2097152 ))
	[ $GB -ge 230 ] && [ $GB -le 240 ] && DEV=/dev/$(basename $b)
done
[ -z "$DEV" ] && { echo "No ~256 GB card found. Nothing done."; exit 1; }
SECTORS=$(cat /sys/block/$(basename $DEV)/size)

echo "Target: $DEV  ($(( SECTORS / 2097152 )) GB, model: $(cat /sys/block/$(basename $DEV)/device/model))"
echo "EVERYTHING on this card will be permanently erased."
printf "Type YES to continue: "
read ans
[ "$ans" = "YES" ] || { echo "Cancelled. Nothing done."; exit 1; }

umount ${DEV}* 2>/dev/null

echo "Clearing old partition tables..."
dd if=/dev/zero of=$DEV bs=1M count=16 conv=fsync 2>/dev/null
dd if=/dev/zero of=$DEV bs=512 seek=$(( SECTORS - 2048 )) count=2048 conv=fsync 2>/dev/null

echo "Creating one partition..."
printf "o\nn\np\n1\n\n\nw\n" | fdisk $DEV >/dev/null 2>&1
sleep 2
[ -b ${DEV}1 ] || { echo "Partition not created, stopping."; exit 1; }

echo "Formatting as ext4 (takes a minute)..."
mkfs.ext4 -F -q -L SERVER -m 0 ${DEV}1 || { echo "Format failed."; exit 1; }

echo "Done. Card formatted:"
blkid ${DEV}1
