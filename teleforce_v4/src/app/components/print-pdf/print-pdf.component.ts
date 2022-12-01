import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ErpService } from './../../erp.service';
import { UserService } from './../../user.service';
import { Router, ActivatedRoute } from "@angular/router";
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
@Component({
  selector: 'app-print-pdf',
  templateUrl: './print-pdf.component.html',
  styleUrls: ['./print-pdf.component.css']
})
export class PrintPdfComponent implements OnInit {
  name;
  leadid = this.route.snapshot.paramMap.get('id');
  constructor(public authService: ErpService, private route: ActivatedRoute, public userservice: UserService) { }
  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;
  htmldoc=false;
  imgdoc=false;

  ngOnInit() {
    this.get_qt()
    //console.log(this.leadid);
    this.getHeaderFooterSetting();
  }
  pdf_data: {
    'customer_name': 'N/A'
  }
  customer_name;
  transaction_date;
  contact_display;
  contact_mobile;
  total_qty;
  total;
  grand_total;
  rounded_total;
  total_gstamount;
  total_discount;
  in_words;
  taxes;
  items;
  headerimg;
  footerimg;
  async get_qt() {
    await this.authService.getleadquotationdetail(this.leadid).then(
      data => {
        //console.log(data['data'])
        this.customer_name = data['data'][0].lead_name
        this.transaction_date = data['data'][0].created_date
        this.name = data['data'][0].quotation_name
        this.contact_mobile = data['data'][0].mobile_no
        this.total_qty = data['data'][0].total_quantity
        this.total = data['data'][0].total_amount
        this.grand_total = data['data'][0].grand_total
        this.total_discount = data['data'][0].total_discount;
        this.total_gstamount = data['data'][0].total_gstamount;
        this.in_words = data['data'][0].grand_total_inword
        console.log(data['data'][0]['items']);

        
        this.items = (data['data'][0]['items'])
        var y = "", j;
        var count = 1;
        this.items.forEach(element => {
          y = y + "<tr><td class='table-sr'>" + count + "</td><td class='' data-fieldname='items' data-fieldtype='Table'><div class='value'>" + element.product_name + "</div></td><td class='' data-fieldname='items' data-fieldtype='Table'><div class='value'>" + element.description + "</div></td><td class='text-right' data-fieldname='items' data-fieldtype='Table'><div class='value'>" + element.quantity + "</div></td><td class='text-right' data-fieldname='items' data-fieldtype='Table'><div class='value'>₹" + element.discount + "</div></td><td class='text-right' data-fieldname='items' data-fieldtype='Table'><div class='value'>₹" + element.product_price + "</div></td><td class='text-right' data-fieldname='items' data-fieldtype='Table'><div class='value'>₹" + element.gst_amount + "</div>("+element.gst+"%)</td><td class='text-right' data-fieldname='items' data-fieldtype='Table'><div class='value'>₹" + element.product_amount + "</div></td></tr>"
          count++;
        });
        document.getElementById("demo2").innerHTML = y;
      },
      err => {
        console.log('error');
      }
    );
  }



  public openPDF(divName) {
    // window.print() 
    var printContents = document.getElementById(divName).innerHTML;
    //console.log(printContents);
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    
    window.print();

    document.body.innerHTML = originalContents;
    // var data = document.getElementById(divName); 
    // html2canvas(data).then(canvas => {  
    //   let imgWidth = 208;   
    //   let pageHeight = 295;    
    //   let imgHeight = canvas.height * imgWidth / canvas.width;  
    //   let heightLeft = imgHeight;  

    //   const contentDataURL = canvas.toDataURL('image/png')  
    //   let pdf = new jsPDF('p', 'mm', 'a4');   
    //   let position = 0;  
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
    //   pdf.save('MYPdf.pdf'); 
    // })
  }
  getHeaderFooterSetting() {
    var userid = localStorage.getItem('access_id');
    this.userservice.getHeaderFooterSetting(userid).then(
      data => {
        if (data['data']) {
          if (data['data']['letter_head'] == 'html') {
            this.htmldoc=true;
            this.imgdoc=false;
            this.headerimg = data['data'].header_html;
            this.footerimg = data['data'].footer_html;
          }
          if (data['data']['letter_head'] == 'image') {
            this.imgdoc=true;
            this.htmldoc=false;
            this.headerimg = data['data'].header_image;
            this.footerimg = data['data'].footer_image;
          }
        }

      },
      err => {
        console.log('error');
      }
    );
  }

}
