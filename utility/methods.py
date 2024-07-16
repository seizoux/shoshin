import os
import time

class SnowflakeIDGenerator:
    """
    A class to generate unique IDs using the Snowflake algorithm.
    The Snowflake algorithm is used to generate unique IDs at a large scale in a distributed environment without the need for a central authority to allocate IDs.
    This class is a Python implementation of the Snowflake algorithm that generates unique IDs using the worker ID, timestamp, and sequence number.
    """
    def __init__(self):
        self.worker_id = os.getpid()
        self.sequence = 0
        self.last_timestamp = -1

    def generate_id(self):
        timestamp = int(time.time() * 1000)

        if timestamp == self.last_timestamp:
            self.sequence = (self.sequence + 1) & 4095
        else:
            self.sequence = 0

        self.last_timestamp = timestamp

        return (timestamp << 22) | (self.worker_id << 12) | self.sequence