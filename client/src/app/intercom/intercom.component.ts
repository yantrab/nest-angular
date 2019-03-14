import { Component, OnInit } from '@angular/core';
// import * as serial from 'cordova-plugin-usbserial/www/usbserial';
declare var serial;
@Component({
  selector: 'p-intercom',
  templateUrl: './intercom.component.html',
  styleUrls: ['./intercom.component.scss']
})
export class IntercomComponent implements OnInit {
  open: boolean;
  lastRead = new Date();
  str = '';
  ngOnInit(): void {
    serial.requestPermission({ driver: 'Ch34xSerialDriver' },
      // if user grants permission
      () => {
        // open serial port
        serial.open(
          { baudRate: 9600 },
          // if port is succesfuly opened
          () => {
            this.open = true;
            // register the read callback
            // serial.registerReadCallback(
            //   (data) => {
            //     // decode the received message
            //     const str = new TextDecoder('utf-8').decode(new Uint8Array(data));
            //   },
            //   // error attaching the callback
            //   this.errorCallback
            // );
          },
          // error opening the port
          this.errorCallback
        );
      },
      // user does not grant permission
      this.errorCallback
    );
  }

  errorCallback(message) {
    alert('Error: ' + message);
  }

  onKeyPress(key: string) {
    console.log(key);
    serial.write(key + '\r');
    // setTimeout(() => serial.write('1' + '\r'), 1000)
  }
}
