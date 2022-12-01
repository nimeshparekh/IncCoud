import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, throwError } from 'rxjs';
import { Contact } from './components/contact-list/contact';
import { catchError, map, tap } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class CrudService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }


  getallsegments(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/segments/getallcontact/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getallsupervisorsegments(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/segments/getsupervisorsegments/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  source_list() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/source_list', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateallsegments(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/segments/getcontactdetail/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  deleteallsegments(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/segments/delete/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  delete_source(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/delete_source/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  // getallcontacts(data){
  //   return new Promise((resolve, reject) => {
  //     const headers = new Headers();
  //    this.http.get(environment.apiUrl+'/contacts/getallcontact/'+data).subscribe((data:any) => {
  //     resolve(data);
  //     }, error =>
  //     {
  //       reject(error);
  //     });
  //   });
  // }

  getCategorylist(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getCategorylist/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getDefaultCategory(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getdefaultcategory/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  deleteallcontacts(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/delete/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  searchCallLog(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/contacts/searchCallLog/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  findContacts(filter, sortcolumn, sortdirection, pageNumber = 0, pageSize = 50): Observable<Contact[]> {
    let userinfo = localStorage.getItem('access_id');
    var params = { user_id: userinfo, sortcolumn: sortcolumn, sortdirection: sortdirection, filter: filter, pageNumber: pageNumber, pageSize: pageSize }
  //   return this.http.post(environment.apiUrl + '/contacts/', params).pipe(
  //     map(res => res["payload"])
  //   );
  const agentrole = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent';

  if (agentrole == 'supervisor') {
    return this.http.post(environment.apiUrl + '/contacts/supervisor_contacts', params).pipe(
      map(res => res["payload"])
    );
  } else {
    return this.http.post(environment.apiUrl + '/contacts/', params).pipe(
      map(res => res["payload"])
    );
  }
  }

  findCall(filter, sortcolumn, sortdirection, pageNumber = 0, pageSize = 50): Observable<Contact[]> {
    let userinfo = localStorage.getItem('access_id');
    var params = { user_id: userinfo, sortcolumn: sortcolumn, sortdirection: sortdirection, filter: filter, pageNumber: pageNumber, pageSize: pageSize }
    const agentrole = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent';
    //console.log(localStorage.getItem('access_id'));
    if (agentrole == 'supervisor') {
      return this.http.post(environment.apiUrl + '/call/supervisor_call_log', params).pipe(
        map(res => res["payload"])
      );
    } else {
      return this.http.post(environment.apiUrl + '/call/', params).pipe(
        map(res => res["payload"])
      );
    }

  }

  findmaster(filter, pageNumber = 0, pageSize = 50): Observable<Contact[]> {
    let userinfo = localStorage.getItem('access_id');
    var params = { user_id: userinfo, filter: filter, pageNumber: pageNumber, pageSize: pageSize }
    return this.http.post(environment.apiUrl + '/master/master', params).pipe(
      map(res => res["payload"])
    );
  }
  totalmaster(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/master/totalmaster', { filter: data }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  findCalllog(filter, sortcolumn, sortdirection, pageNumber = 0, pageSize = 50): Observable<Contact[]> {
    let userinfo = localStorage.getItem('access_id');
    var params = { user_id: userinfo, sortcolumn: sortcolumn, sortdirection: sortdirection, filter: filter, pageNumber: pageNumber, pageSize: pageSize }
    return this.http.post(environment.apiUrl + '/contacts/CampaignCallLog', params).pipe(
      map(res => res["payload"])
    );
  }

  totalcount(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/master/citycountlist', { filter: data }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  totalpincount(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/master/pincountlist', { filter: data }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  findmastersegment(filter, pageNumber = 0, pageSize = 50): Observable<Contact[]> {
    let userinfo = localStorage.getItem('access_id');
    var params = { user_id: userinfo, filter: filter, pageNumber: pageNumber, pageSize: pageSize }
    return this.http.post(environment.apiUrl + '/master/citycount', params).pipe(
      map(res => res["payload"])
    );
  }

  findmasterpincode(filter, pageNumber = 0, pageSize = 50): Observable<Contact[]> {
    let userinfo = localStorage.getItem('access_id');
    var params = { user_id: userinfo, filter: filter, pageNumber: pageNumber, pageSize: pageSize }
    return this.http.post(environment.apiUrl + '/master/pincodecount', params).pipe(
      map(res => res["payload"])
    );
  }

  totalcountgraph(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/master/citycountlisttop10', { filter: data }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  totalpincountgraph(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/master/pincountlisttop10', { filter: data }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  checkCallerNumber(userid, mobileno) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      var data = { userid: userid, mobileno: mobileno }
      this.http.post(environment.apiUrl + '/contacts/checkCallerNumber', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateCallogData(data, id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      var name = data.name;
      var udata = { id: id, CallerName: name };
      this.http.post(environment.apiUrl + '/call/updateCallogData/', udata).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deletecontactmeta(metaid) {
    //console.log(metaid);
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/contacts/deletecontactmetadata/'+metaid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getsupervisorallsegments(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/segments/getsupervisorallsegments/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


}
