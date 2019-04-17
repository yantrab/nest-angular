import { Injectable } from '@angular/core';
import * as XLSX from './xlsx';
import { saveAs } from 'file-saver';
export class XLSXData {
  rows: Object[];
  description?: {};
  title?: string;
}
type AOA = Array<Array<any>>;
@Injectable()
export class XLSXService {
  constructor() {
  }
  private wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };

  private s2ab(s: string): ArrayBuffer {
    const buf: ArrayBuffer = new ArrayBuffer(s.length);
    const view: Uint8Array = new Uint8Array(buf);
    // tslint:disable-next-line: no-bitwise
    for (let i = 0; i !== s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF; }
    return buf;
  }

  export(sheetsData: XLSXData[], sheetNames: string[], fileName): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    sheetsData.forEach((data, i) => {
      // Auto Fit Column Widths
      const colsWidth = [];
      Object.keys(data.rows[0]).forEach((key, i) => {
        if (typeof data.rows[0][key].getMonth === 'function') {
          colsWidth[i] = { wpx: 70 };
          return;
        }
        const items = data.rows.map(r => r[key].toString());
        items.push(key);
        const maxStrLength = items.reduce((a, b) => a.length > b.length ? a : b).length;
        colsWidth[i] = { wch: maxStrLength + 1 };
      });

      const aoa: AOA = new Array<Array<any>>();// = _.keys(data.rows[0]).concat(['','','','','','',])
      const merges = [];
      if (data.title) {
        aoa.push([data.title]);
        merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 15 } });
      }

      aoa.push(Object.keys(data.rows[0]).map(key => key).concat(['', '', '', '', '', '',]));
      data.rows.forEach((v, i) => {
        aoa.push(Object.values<any>(data.rows[i]).concat(['', '', '', '', '', '',]));
      });
      if (data.description) {
        Object.keys(data.description).forEach((key, i) => {
          aoa[1 + i][aoa[0].length - 2] = key;
          aoa[1 + i][aoa[0].length - 3] = data.description[key];
        });
      }
      const sheet = XLSX.utils.aoa_to_sheet(aoa, { cellDates: true });
      sheet['!cols'] = colsWidth;
      sheet['!merges'] = merges;
      wb.Sheets[sheetNames[i]] = sheet;
    });
    wb.SheetNames = sheetNames;
    /* save to file */
    const wbout: string = XLSX.write(wb, this.wopts);
    saveAs(new Blob([this.s2ab(wbout)]), fileName);
  }
}