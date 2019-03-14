import { Component, OnInit } from '@angular/core';
// import * as serial from 'cordova-plugin-usbserial/www/usbserial';
declare var serial;
@Component({
  selector: 'p-intercom',
  templateUrl: './intercom.component.html',
  styleUrls: ['./intercom.component.scss']
})
export class IntercomComponent {
  open: boolean;
  lastRead = new Date();
  str = '';
  constructor() {
    setTimeout(() => this.openConnection(), 5000);
    // this.onDeviceReady();
    // document.addEventListener('deviceready', this.onDeviceReady, false);
  }
  openConnection(): void {
    alert('openConnection');
    serial.requestPermission({ driver: 'Ch34xSerialDriver' },
      // if user grants permission
      function (successMessage) {
        alert(successMessage);
        // open serial port
        serial.open(
          { baudRate: 9600 },
          // if port is succesfuly opened
          // tslint:disable-next-line: no-shadowed-variable
          function (successMessage) {
            alert(successMessage);
            // register the read callback
            serial.registerReadCallback(
              function (data) {
                alert(data);
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
    // if (!this.open) {
    //   this.openConnection();
    // }

    serial.write(key.charCodeAt(0) + 'CR');
  }
}
