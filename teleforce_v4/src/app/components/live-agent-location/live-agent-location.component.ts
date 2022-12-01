import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from "@angular/router";
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps'


@Component({
  selector: 'app-live-agent-location',
  templateUrl: './live-agent-location.component.html',
  styleUrls: ['./live-agent-location.component.css']
})
export class LiveAgentLocationComponent implements OnInit {

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow

  zoom = 12
  center: google.maps.LatLngLiteral
  markers = []
  infoContent = ''
  isLoading = false

  public searchform: FormGroup;
  agents = [];
  google = '';

  constructor(
    private fb: FormBuilder,
    private userservice: UserService,
    private router: Router) { }

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid: [userid],
      agentid: [null, Validators.required],
      date: [null]
    });
    this.getAgents();
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: 20.0000,
        lng: 78.0000,
      }
    })
   // this.addMarker();
    this.getAgentLocation();
  }


  openInfo(marker: MapMarker, content) {
    this.infoContent = content
    this.info.open(marker)
  }

  async searchData(){
    this. isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.userservice.searchAgentLocation(data).then(
      data => {
        this.isLoading=false;
        if (data) {
          // console.log(data['data']);
           for (var i = 0; i < data['data'].length; i++) {
             //console.log();
             var data1 = {
               position: {
                 lat: Number(data['data'][i].latitude),
                 lng: Number(data['data'][i].longitude),
               },
               label: {
                 color: 'red',
                 text: data['data'][i].area_name!=''?data['data'][i].area_name+', '+data['data'][i].city:data['data'][i].city,
               },
               title: data['data'][i].full_address,
               info: data['data'][i].full_address,
               options: {
                 animation: google.maps.Animation.BOUNCE,
               },
             };
             this.markers.push(data1);
             
             
           }
           console.log(this.markers);
         }
      },
      err => {
        console.log('error');
      }
    );
  }

  async getAgents() {
    let userinfo = localStorage.getItem('access_id');
    await this.userservice.getAgents(userinfo).then(data => {
      if (data) {
        this.agents = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
  async getAgentLocation() {
    let userinfo = localStorage.getItem('access_id');
    await this.userservice.getAgentLocation(userinfo).then(data => {
      if (data) {
       // console.log(data['data']);
        for (var i = 0; i < data['data'].length; i++) {
          //console.log();
          var data1 = {
            position: {
              lat: Number(data['data'][i].latitude),
              lng: Number(data['data'][i].longitude),
            },
            label: {
              color: 'red',
              text: data['data'][i].area_name!=''?data['data'][i].area_name+', '+data['data'][i].city:data['data'][i].city,
            },
            title: data['data'][i].full_address,
            info: data['data'][i].full_address,
            options: {
              animation: google.maps.Animation.BOUNCE,
            },
          };
          this.markers.push(data1);
          
          
        }
        //console.log(this.markers);
      }
      },
      err => {
        console.log('error');
      })
  }

  async checkkyc(id) {
    //console.log(id);   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if (data['data'][0].kyc_status == 1 || data['data'][0].status == 1) {

        } else {
          this.router.navigate(['/kyc-document-upload']);
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  showMap() {
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 13,
      }
    );
    const card = document.getElementById("pac-card") as HTMLElement;
    const input = document.getElementById("pac-input") as HTMLInputElement;

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    const autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo("bounds", map);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(["address_components", "geometry", "icon", "name"]);

    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById(
      "infowindow-content"
    ) as HTMLElement;
    infowindow.setContent(infowindowContent);
    const marker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);
      const place = autocomplete.getPlace();

      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17); // Why 17? Because it looks good.
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      let address = "";

      if (place.address_components) {
        address = [
          (place.address_components[0] &&
            place.address_components[0].short_name) ||
          "",
          (place.address_components[1] &&
            place.address_components[1].short_name) ||
          "",
          (place.address_components[2] &&
            place.address_components[2].short_name) ||
          "",
        ].join(" ");
      }

      infowindowContent.children["place-icon"].src = place.icon;
      infowindowContent.children["place-name"].textContent = place.name;
      infowindowContent.children["place-address"].textContent = address;
      infowindow.open(map, marker);
    });

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
      const radioButton = document.getElementById(id) as HTMLInputElement;
      radioButton.addEventListener("click", () => {
        autocomplete.setTypes(types);
      });
    }

    setupClickListener("changetype-all", []);
    setupClickListener("changetype-address", ["address"]);
    setupClickListener("changetype-establishment", ["establishment"]);
    setupClickListener("changetype-geocode", ["geocode"]);

    (document.getElementById(
      "use-strict-bounds"
    ) as HTMLInputElement).addEventListener("click", function () {
      console.log("Checkbox clicked! New state=" + this.checked);
      autocomplete.setOptions({ strictBounds: this.checked });
    });
  }


}
