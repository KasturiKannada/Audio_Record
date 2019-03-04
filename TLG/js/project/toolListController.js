tlgApp.controller('toolListController', ['$scope', 'internationalizationService', 'Constant.labels', '$timeout', '$http', '$window', '$rootScope', 'dataService', '$routeParams', 'apiUrl', function($scope, internationalizationService, Constantlabels, $timeout, $http, $window, $rootScope, dataService, $routeParams, apiUrl) {
//     $scope.labels_sst = {};
//     jQuery.extend(true, $scope.labels_sst, internationalizationService.get(Constantlabels.sst));
//     if ($scope.labels_sst == null) {
//         alert("Failed to render the labels! Please refresh the page . If problem persists, contact support.");
//     }

// $(document).on("click", "#loginanchor", function() {
//       $rootScope.logoutonclick();
// });
navigator.getUserMedia = navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia;

// if (navigator.getUserMedia) {

//          navigator.getUserMedia({ audio: true, video: { width: 1280, height: 720 } })
//   .then(stream => {
//     rec = new MediaRecorder(stream);
//     rec.ondataavailable = e => {
//       audio.push(e.data);
//       if (rec.state == "inactive") {
//         let blob = new Blob(audio, {
//           type: 'audio/x-mpeg-3'
//         });
//         recordedAudio.src = URL.createObjectURL(blob);
//         recordedAudio.controls = true;
//         audioDownload.href = recordedAudio.src;
//         audioDownload.download = 'audio.mp3';
//         audioDownload.innerHTML = 'Download';
//         submit(blob);
//       }
//     }
//   })
//   .catch(e => console.log(e));
// }

if (navigator.getUserMedia) {
  stopRecord.disabled = true;
  submitRecord.disabled = true;
  cancelRecord.disabled = true;
 navigator.getUserMedia({ audio: true},
  function(stream) {
    rec = new MediaRecorder(stream);
    rec.ondataavailable = e => {
      audio.push(e.data);
      if (rec.state == "inactive") {
        let blob = new Blob(audio, {
          type: 'audio/x-mpeg-3'
        });
        $scope.blobdata=blob
        recordedAudio.src = URL.createObjectURL(blob);
        recordedAudio.controls = true;
        // audioDownload.href = recordedAudio.src;
        // audioDownload.download = 'audio.mp3';
        // audioDownload.innerHTML = 'Download';
        // submit(blob);
      }
    }
  },
  function(err) {
   console.log("The following error occurred: " + err.name);
 }
 );
} else {
 console.log("getUserMedia not supported");
}

// TODO: This needs work. Submit button currently does not do anything.
// Also, page does not get reloaded and therefore the results are not shown.
// The POST request has to be done without AJAX.

$scope.startRecording=function () {
   $scope.showimage=true;
  startRecord.disabled = true;
  stopRecord.disabled = false;
  cancelRecord.disabled = false;
  audio = [];
  recordedAudio.controls = false;
  rec.start();
}

$scope.stopRecording=function () {
    $scope.showimage=false;
  startRecord.disabled = false;
  stopRecord.disabled = true;
  submitRecord.disabled = false;
  cancelRecord.disabled = false;
  rec.stop();
}
$scope.submit=function() {
  var reader = new window.FileReader();
  reader.readAsDataURL($scope.blobdata);
  reader.onloadend = function() {
    var fd = new FormData();
    base64data = reader.result;
    // base64data = base64data.replace('data:audio/x-mpeg-3;base64,', '');
    // console.log(base64data);
    // fd.append('file', base64data, 'audio.mp3');
    $.ajax({
      type: 'POST',
      // url: "http://127.0.0.1:5000/store_file?language="+ base64data +"&topic="+$scope.topic+"&index="+$scope.index,
      url: "http://127.0.0.1:5000/store_file",
      data: JSON.stringify({'language':base64data,'topic':$scope.topic,'index':$scope.index}),
      cache: false,
      cache: false,
      processData: false,
     contentType: "application/json",
        dataType: 'json',
    }).done(function(data) {
      alertify.success("audio saved successfully..");
       stopRecord.disabled = true;
  submitRecord.disabled = true;
  cancelRecord.disabled = true;
  recordedAudio.controls = false;
  $scope.initialize();
    });
     alertify.success("audio saved successfully..");
       stopRecord.disabled = true;
  submitRecord.disabled = true;
  cancelRecord.disabled = true;
  recordedAudio.controls = false;
  $scope.initialize();
//     $.ajax({
//   url: "http://127.0.0.1:5000/store_file",
//       data: JSON.stringify({'language':base64data,'topic':$scope.topic,'index':$scope.index}),
//       cache: false,
//   type: 'POST',
//   traditional: true,
//  contentType: "application/json",
//         dataType: 'json',
// }).done(function(data) {
//       alertify.success("audio saved succesfully..");
//        stopRecord.disabled = true;
//   submitRecord.disabled = true;
//   cancelRecord.disabled = true;
//   recordedAudio.controls = false;
//   $scope.initialize();
//     });
  }
}
$scope.cancelaudio=function(){
    $scope.showimage=false;
  recordedAudio.controls = false;
   startRecord.disabled = false;
  stopRecord.disabled = true;
  submitRecord.disabled = true;
  cancelRecord.disabled = true;
}

// function saveBase64AsAudioFile(folderpath,filename,content,contentType){
//     // Convert the base64 string in a Blob
//     var DataBlob = b64toBlob(content,contentType);

//     console.log("Starting to write the file :3");

//     window.resolveLocalFileSystemURL(folderpath, function(dir) {
//         console.log("Access to the directory granted succesfully");
//         dir.getFile(filename, {create:true}, function(file) {
//             console.log("File created succesfully.");
//             file.createWriter(function(fileWriter) {
//                 console.log("Writing content to file");
//                 fileWriter.write(DataBlob);
//             }, function(){
//                 alert('Unable to save file in path '+ folderpath);
//             });
//         });
//     });
// }


$scope.initialize = function() {
  if (navigator.getUserMedia) {
    $scope.showimage=false;
  stopRecord.disabled = true;
  submitRecord.disabled = true;
  cancelRecord.disabled = true;
 navigator.getUserMedia({ audio: true},
  function(stream) {
    rec = new MediaRecorder(stream);
    rec.ondataavailable = e => {
      audio.push(e.data);
      if (rec.state == "inactive") {
        let blob = new Blob(audio, {
          type: 'audio/x-mpeg-3'
        });
        $scope.blobdata=blob
        recordedAudio.src = URL.createObjectURL(blob);
        recordedAudio.controls = true;
      }
    }
  },
  function(err) {
   console.log("The following error occurred: " + err.name);
 }
 );
} else {
 console.log("getUserMedia not supported");
}
  $scope.timeLimit = 10;
  var randomNumber = Math.floor(Math.random() * 16)
  $http({
    url: "/pages/mockdata/abc.json",
    method: "GET",
    headers: {'Content-Type':'application/json','Accept':'application/json',"Authorization":dataService.getUserToken()}
  }).then(function(response) {
    $scope.datalist=response.data.data;
      $scope.text= $scope.datalist[randomNumber].text;
        $scope.index=$scope.datalist[randomNumber].index;
        $scope.topic=$scope.datalist[randomNumber].topic;
    // angular.forEach(response.data.data, function(tool,index){
    //   if(index===0){
    //     $scope.text=tool.text;
    //     $scope.index=tool.index;
    //     $scope.topic=tool.topic;
    //   }
    // });
  }, 
  function(error){
    if(error.status===401){
      $rootScope.authenticationFailure();
    }else{
      alertify.error("tool Failure");
    }
  });
}
$scope.initialize();
}]);

