# Python program to implement  
# WebCam Motion Detector 
  
# importing OpenCV, time and Pandas library 
import cv2, time, pandas, logging, base64
# importing datetime class from datetime library 
from datetime import datetime

import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.queue_declare(queue='observation')


  
# Assigning our static_back to None 
static_back = None
  
# List when any moving object appear
motion_list = [ None, None ]
  
# Time of movement 
time = [] 
  
# Initializing DataFrame, one column is start  
# time and other column is end time 
df = pandas.DataFrame(columns = ["Start", "End"]) 
  
# Capturing video 
video = cv2.VideoCapture(0) 
  
# Infinite while loop to treat stack of image as video 
while True: 
    # Reading frame(image) from video 
    check, frame = video.read() 
  
    # Initializing motion = 0(no motion) 
    motion = 0
  
    # Converting color image to gray_scale image 
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) 
  
    # Converting gray scale image to GaussianBlur  
    # so that change can be find easily 
    gray = cv2.GaussianBlur(gray, (41, 41), 0) 
  
    # In first iteration we assign the value  
    # of static_back to our first frame 
    if static_back is None: 
        static_back = gray 
        continue
  
    # Difference between static background  
    # and current frame(which is GaussianBlur) 
    diff_frame = cv2.absdiff(static_back, gray) 
  
    # If change in between static background and 
    # current frame is greater than 30 it will show white color(255) 
    thresh_frame = cv2.threshold(diff_frame, 100, 255, cv2.THRESH_BINARY)[1] 
    thresh_frame = cv2.dilate(thresh_frame, None, iterations = 2) 
  
    # Finding contour of moving object 
    (cnts, _) = cv2.findContours(thresh_frame.copy(),  
                       cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE) 

    if len(cnts)>6:
        try:
            print('motion detected')
            retval, buffer = cv2.imencode('.jpg', frame)
            jpg_as_text = base64.b64encode(buffer)
            channel.basic_publish(exchange='',
                        routing_key='observation',
                        body=jpg_as_text)
        except Exception as e:
            print(e)
            connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
            channel = connection.channel()

            channel.queue_declare(queue='observation')

connection.close()