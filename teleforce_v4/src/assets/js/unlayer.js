unlayer.init({
    id: 'editor',
    projectId: 5309,
    displayMode: 'email',
    //templateId: "[TEMPLATE-ID]"
})
unlayer.registerCallback('image', function(file, done) {
  var uid = localStorage.getItem('access_id');
  console.log('uid:'+uid);
  var data = new FormData();
  console.log(file.attachments);
  data.append('file', file.attachments[0])
  data.append('customerid', uid)
  fetch('/api/tfapi/uploads', {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: data
  }).then(response => {
    // Make sure the response was valid
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }).then(response => {
    return response.json()
  }).then(data => {
    // Pass the URL back to Unlayer to mark this upload as completed
    done({ progress: 100, url: data.filelink })
  })
})
unlayer.addEventListener('design:updated', function(updates) {
  // Design is updated by the user  
  unlayer.exportHtml(function(data) {
    var json = data.design; // design json
    var html = data.html; // design html
    localStorage.setItem('savedesign',JSON.stringify(json))
    localStorage.setItem('savedesignhtml',html)
    // Save the json, or html here
  })
})
//Load Design
setTimeout(function(){ unlayer.loadDesign(JSON.parse(localStorage.getItem('savedesign'))); }, 5000);
