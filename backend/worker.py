import time
from ai import process_emails

print("ai automation worker started")

while True:

    print("Checking for pending emails...")

    process_emails()

    time.sleep(10)

