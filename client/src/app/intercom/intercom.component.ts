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
    serial.requestPermission(
      // if user grants permission
      () => {
        // open serial port
        serial.open(
          { baudRate: 9600 },
          // if port is succesfuly opened
          () => {
            this.open = true;
            // register the read callback
            serial.registerReadCallback(
              function success(data) {
                // decode the received message
                const view = new Uint8Array(data);
                console.log(view);
              },
              // error attaching the callback
              this.errorCallback
            );
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
    serial.write(key.charCodeAt(0) + 'CR');
  }
}
