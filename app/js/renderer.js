// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const remote = require('electron').remote;
const {
    dialog
} = require('electron').remote;
let ipcRenderer = require('electron').ipcRenderer;

window.ELECTRON_DISABLE_SECURITY_WARNINGS = true

ipcRenderer.on('vid1-file', function(event, store) {
    obj = document.createElement('video');
obj.setAttribute('id', 'example_video_test');
obj.setAttribute('class', 'video-js vjs-default-skin');
obj.setAttribute('width', '640');
obj.setAttribute('data-height', '264');
obj.setAttribute('controls', ' ');
obj.setAttribute('preload', 'auto');
obj.setAttribute('data-setup', '{}');
source = document.createElement('source');
    source.setAttribute('type', 'application/x-mpegURL')
    source.setAttribute('src', 'file://private' + store)

    // (obj).append(source);
    document.getElementById('transFile1Div').appendChild(obj)
    obj.appendChild(source)
    
});


// var ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('cat-progress', function (event, store) {
    // console.log(store);mp4Loading.setAttribute("aria-valuenow", progressValue + "%")
    document.getElementById('cat-progress').style.width = store

});
ipcRenderer.on('cat-status', function (event, store) {
    document.getElementById('cat-status').innerHTML = store
});

ipcRenderer.on('cat-sub', function (event, store) {
    document.getElementById('cat-sub').innerHTML = store
});


ipcRenderer.on('mux-progress', function (event, store) {
    // console.log(store);mp4Loading.setAttribute("aria-valuenow", progressValue + "%")
    document.getElementById('mux-progress').style.width = store

});
ipcRenderer.on('mux-status', function (event, store) {
    document.getElementById('mux-status').innerHTML = store
});

ipcRenderer.on('mux-sub', function (event, store) {
    document.getElementById('mux-sub').innerHTML = store
});

ipcRenderer.on('trans-progress', function (event, store) {
    // console.log(store);mp4Loading.setAttribute("aria-valuenow", progressValue + "%")
    console.log(store)
    document.getElementById('trans-progress').style.width = store

});

ipcRenderer.on('trans-status', function (event, store) {
    document.getElementById('trans-status').innerHTML = store
});

ipcRenderer.on('trans-sub', function (event, store) {
    document.getElementById('trans-sub').innerHTML = store
    // if (store == "Done") {
    //     document.getElementById("killTransButton").style.display="None"
    //     document.getElementById("submitTrans").style.display="inline-block"
    // }
});

ipcRenderer.on('trans-done', function (event, store) {
    // document.location.reload()
    document.getElementById('popup-title').innerHTML = "Success, your file is done."
    document.getElementById('popup-body').innerHTML = store
    document.getElementById('results').classList.add("show")
    document.getElementById('results').style.display="inline-block"

})

ipcRenderer.on('mux-done', function (event, store) {
    document.getElementById('popup-title').innerHTML = "Success, your file is done."
    document.getElementById('popup-body').innerHTML = store
    document.getElementById('results').classList.add("show")
    document.getElementById('results').style.display="inline-block"
    // document.location.reload()
})

ipcRenderer.on('cat-done', function (event, store) {
    
    document.getElementById('popup-title').innerHTML = "Success, your file is done."
    document.getElementById('popup-body').innerHTML = store
    document.getElementById('results').classList.add("show")
    document.getElementById('results').style.display="inline-block"
})

ipcRenderer.on('dstreamURL-done', function (event, store) {
    // document.location.reload()
    document.getElementById('popup-title').innerHTML = "Success, your file is done."
    document.getElementById('popup-body').innerHTML = store
    document.getElementById('results').classList.add("show")
    document.getElementById('results').style.display="inline-block"
})

ipcRenderer.on('dstreamURL-progress', function (event, store) {
    // console.log(store);mp4Loading.setAttribute("aria-valuenow", progressValue + "%")
    document.getElementById('dstreamURL-progress').style.width = store

});

ipcRenderer.on('dstreamURL-status', function (event, store) {
    document.getElementById('dstreamURL-status').innerHTML = store
});

ipcRenderer.on('dstreamURL-sub', function (event, store) {
    document.getElementById('dstreamURL-sub').innerHTML = store
});

function killTrans() {
    ipcRenderer.send('killTrans');
}

function killMux() {
    ipcRenderer.send('killMux');
}

// function playTransVid1(path) {
//     ipcRenderer.send('trans-file-1', path)
// }

function submitCat() {
    console.log("submitting cat form")
    if (catVideoFile1.innerHTML == "Drag video file here<br>Or click to select." || catVideoFile2.innerHTML == "Drag video file 2 here<br>Or click to select." || catOut.innerHTML == "Output Location") {
        alert("make sure to fill out all fields")
        return false
    } else {
        if (catAudioFile1.innerHTML == "Choose Audio File" || catAudioFile1.innerHTML == "Must be an audio files in aac, wav, mp3, or mp4 format.") {
            audio = "None"
        } else {
            audio = catAudioFile1.innerHTML
        }
        document.getElementById("killCatButton").style.display="inline-block"
            document.getElementById("submitCat").style.display="None"
            if (document.getElementById("cat-progress").classList.contains("bg-danger")) {
                document.getElementById("cat-progress").classList.remove("bg-danger")
                document.getElementById("cat-progress").classList.add("bg-success")
            }
        let formData = {
            "vid1": catVideoFile1.innerHTML,
            "vid2": catVideoFile2.innerHTML,
            "audio": audio,
            "output": catOut.innerHTML
            // 'file': fs.createReadStream(absFilePath)
        };
        ipcRenderer.send('submitCatForm', formData);
    }
}

function submitMux() {
    console.log("submitting mux form")
    if (muxVideoFile1.innerHTML.includes("Drag video file here") || muxOut.innerHTML.includes("Output Location") || muxVideoFile1.innerHTML.includes("Must be a video file.")) {
        alert("make sure to fill out all fields")
        return false
    } else {
        if (muxAudioFile1.innerHTML.includes("Drag audio file here") || muxAudioFile1.innerHTML.includes("Must be an audio files in aac, wav, mp3, or mp4 format.")) {
            audio = "None"
        } else {
            audio = muxAudioFile1.innerHTML
        }
        if (muxVideoFile1.innerHTML.includes("Drag video file here")) {
            video = "None"
        } else {
            video = muxVideoFile1.innerHTML
        }
        
        document.getElementById("killMuxButton").style.display="inline-block"
            document.getElementById("submitMux").style.display="None"
            if (document.getElementById("mux-progress").classList.contains("bg-danger")) {
                document.getElementById("mux-progress").classList.remove("bg-danger")
                document.getElementById("mux-progress").classList.add("bg-success")
            }
        let formData = {
            "vid1": video.split('<br>'),
            "audio": audio,
            "output": muxOut.innerHTML,
            "extractMux": document.getElementById('extractMux').checked
            
        };
        ipcRenderer.send('submitmuxForm', formData);
    }
}

function submitTrans() {
    console.log("submitting trans form")
    if (transOut.innerHTML == "Output Location" || transVideoFile1.innerHTML == "Must be a video file.") {
        alert("make sure to fill out all fields")
        return false
    } else {
        if (transVideoFile1.innerHTML.includes("Drag video file here")) {
            video = "None"
        } else {
            video = transVideoFile1.innerHTML
        }
        if (transAudioFile1.innerHTML.includes("Drag single audio file here")) {
            audio = "None"

        } else {
            audio = transAudioFile1.innerHTML
        }
        document.getElementById("killTransButton").style.display="inline-block"
            document.getElementById("submitTrans").style.display="None"
            if (document.getElementById("trans-progress").classList.contains("bg-danger")) {
                document.getElementById("trans-progress").classList.remove("bg-danger")
                document.getElementById("trans-progress").classList.add("bg-success")
            }
        let formData = {
            "vid1": video.split('<br>'),
            "audio": audio,
            "output": transOut.innerHTML,
            "highQuality": document.getElementById('2pass').checked,
            "video1080p": document.getElementById('1080p').checked,
            "video720p": document.getElementById('720p').checked,
            "video360p": document.getElementById('360p').checked,
            "audio320k": document.getElementById('320k').checked,
            "audio128k":document.getElementById('128k').checked,
            "audio32k":document.getElementById('32k').checked
        };
        ipcRenderer.send('submitTransForm', formData);
    }
}

function submitdstreamURL() {
    console.log("submitting dstream form")
    if (dstreamURLFile1.value == undefined || dstreamOut.innerHTML == "Output Location") {
        alert("make sure to fill out all fields")
        return false
    }
    document.getElementById("killdstreamURLButton").style.display="inline-block"
            document.getElementById("submitdstreamURL").style.display="None"
            if (document.getElementById("dstreamURL-progress").classList.contains("bg-danger")) {
                document.getElementById("dstreamURL-progress").classList.remove("bg-danger")
                document.getElementById("dstreamURL-progress").classList.add("bg-success")
            }
    let formData = {
        "vid1": dstreamURLFile1.value,
        "output": dstreamOut.innerHTML
    };
    ipcRenderer.send('submitdstreamURLForm', formData);
}


(function handleWindowControls() {
    // When document has loaded, initialise
    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            init();
        }
    };

    function init() {
        let window = remote.getCurrentWindow();
        const minButton = document.getElementById('btn_min'),
            maxButton = document.getElementById('btn_max'),
            closeButton = document.getElementById('btn_close');
        catVideoFile1 = document.getElementById("catVid1File") //Span ID
        catVideoFile2 = document.getElementById("catVid2File") //Span ID
        catAudioFile1 = document.getElementById("catAud1File") //Span ID
        catInVid1 = document.getElementById("catVid1Input") //input ID
        catInVid2 = document.getElementById("catVid2Input") //input ID
        catInAud1 = document.getElementById("catAud1Input") //input ID
        catVid1 = document.getElementById("cat-vid-1") //Label Active Listener for Drag 'n Drop
        catVid2 = document.getElementById("cat-vid-2") //Label Active Listener for Drag 'n Drop
        catAud1 = document.getElementById("cat-aud-1") //Label Active Listener for Drag 'n Drop
        catOut = document.getElementById("catOut") //Span ID
        catOutInput = document.getElementById("catOutInput") // input ID
        muxVideoFile1 = document.getElementById("muxVid1File") //Span ID
        muxAudioFile1 = document.getElementById("muxAud1File") //Span ID
        muxInVid1 = document.getElementById("muxVid1Input") //input ID
        muxInAud1 = document.getElementById("muxAud1Input") //input ID
        muxVid1 = document.getElementById("mux-vid-1") //Label Active Listener for Drag 'n Drop
        muxAud1 = document.getElementById("mux-aud-1") //Label Active Listener for Drag 'n Drop
        muxOut = document.getElementById("muxOut") //Span ID
        muxOutInput = document.getElementById("muxOutInput") // input ID
        transVideoFile1 = document.getElementById("transVid1File") //Span ID
        transAudioFile1 = document.getElementById("transAud1File") //Span ID
        transInVid1 = document.getElementById("transVid1Input") //input ID
        transInAud1 = document.getElementById("transAud1Input") //input ID
        transVid1 = document.getElementById("trans-vid-1") //Label Active Listener for Drag 'n Drop
        transAud1 = document.getElementById("trans-aud-1") //Label Active Listener for Drag 'n Drop
        transOut = document.getElementById("transOut") //Span ID
        transOutInput = document.getElementById("transOutInput") // input ID
        killTransButton = document.getElementById("killTransButton"); //input ID
        killMuxButton = document.getElementById("killMuxButton"); //input ID
        killCatButton = document.getElementById("killCatButton"); //input ID
        killdstreamURLButton = document.getElementById("killdstreamURLButton"); //input ID
        dstreamURLFile1 = document.getElementById("dstreamURLInput") //Span ID
        dstreamInVid1 = document.getElementById("dstreamURLInput") //input ID
        dstreamOut = document.getElementById("dstreamURLOut") //Span ID
        dstreamOutInput = document.getElementById("dstreamURLOutInput") // input ID
        lkfsURLFile1 = document.getElementById("lkfsURLInput") //Span ID
        lkfsInVid1 = document.getElementById("lkfsURLInput") //input ID
        lkfsOut = document.getElementById("lkfsURLOut") //Span ID
        lkfsOutInput = document.getElementById("lkfsURLOutInput") // input ID

        document.querySelector('#killTransButton').addEventListener('click', () => {
            document.getElementById("killTransButton").style.display="None"
            document.getElementById("submitTrans").style.display="inline-block"
            document.getElementById("trans-progress").classList.remove("bg-success")
            document.getElementById("trans-progress").classList.add("bg-danger")
            killTrans()

        })

        document.querySelector('#killMuxButton').addEventListener('click', () => {
            // ipcRenderer.send('killTransButton');
            killMux()
        })

        document.querySelector('#killCatButton').addEventListener('click', () => {
            // ipcRenderer.send('killTransButton');
            killCat()
        })

        document.querySelector('#killdstreamURLButton').addEventListener('click', () => {
            // ipcRenderer.send('killTransButton');
            killdstreamURL()
        })


        document.querySelector('#submitCat').addEventListener('click', () => {
            
            submitCat()
        })

        document.querySelector('#submitMux').addEventListener('click', () => {
            // document.getElementById("killMuxButton").style.display="inline-block"
            // document.getElementById("submitMux").style.display="None"
            // if (document.getElementById("mux-progress").classList.contains("bg-danger")) {
            //     document.getElementById("mux-progress").classList.remove("bg-danger")
            //     document.getElementById("mux-progress").classList.add("bg-success")
            // }
            
            submitMux()
        })

        document.querySelector('#submitTrans').addEventListener('click', () => {
            // document.getElementById("killTransButton").style.display="inline-block"
            // document.getElementById("submitTrans").style.display="None"
            // if (document.getElementById("trans-progress").classList.contains("bg-danger")) {
            //     document.getElementById("trans-progress").classList.remove("bg-danger")
            //     document.getElementById("trans-progress").classList.add("bg-success")
            // }
            submitTrans()
        })

        document.querySelector('#submitdstreamURL').addEventListener('click', () => {
            // document.getElementById("killdstreamURLButton").style.display="inline-block"
            // document.getElementById("submitdstreamURL").style.display="None"
            // if (document.getElementById("dstreamURL-progress").classList.contains("bg-danger")) {
            //     document.getElementById("dstreamURL-progress").classList.remove("bg-danger")
            //     document.getElementById("dstreamURL-progress").classList.add("bg-success")
            // }
            submitdstreamURL()
        })



        catVid1.addEventListener('drop', (e) => {
            catVid1Input.files = e.dataTransfer.files
            e.preventDefault();
            e.stopPropagation();
            for (const f of e.dataTransfer.files) {
                if (f.path.includes(".mp4") || f.path.includes(".ts") || f.path.includes(".mkv") || f.path.includes(".h264")) {

                    catVideoFile1.classList.add("success-video")
                    if (catVideoFile1.classList.contains("failed-video")) {
                        catVideoFile1.classList.remove("failed-video")
                    }
                    catVideoFile1.innerHTML = f.path

                } else {
                    catVideoFile1.innerHTML = "Must be a compressed file with h264 as the codec."
                    catVideoFile1.classList.add("failed-video")
                    if (catVideoFile1.classList.contains("success-video")) {
                        catVideoFile1.classList.remove("success-video")
                    }
                    return false;
                }


            }
        });
        catVid1.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        catInVid1.addEventListener('change', (e) => {
            if (catInVid1.files[0].path.includes(".mp4") || catInVid1.files[0].path.includes(".ts") || catInVid1.files[0].path.includes(".mkv") || catInVid1.files[0].path.includes(".h264")) {
                // catVideoFile1.style.color = "Green"
                catVideoFile1.classList.add("success-video")
                if (catVideoFile1.classList.contains("failed-video")) {
                    catVideoFile1.classList.remove("failed-video")
                }
                catVideoFile1.innerHTML = catInVid1.files[0].path
            } else {
                catVideoFile1.innerHTML = "Must be a compressed file with h264 as the codec."
                // catVideoFile1.style.color = "Red"
                catVideoFile1.classList.add("failed-video")
                if (catVideoFile1.classList.contains("success-video")) {
                    catVideoFile1.classList.remove("success-video")
                }
                return false;
            }
        })

        catVid2.addEventListener('drop', (e) => {
            catVid2Input.files = e.dataTransfer.files
            e.preventDefault();
            e.stopPropagation();
            for (const f of e.dataTransfer.files) {
                if (f.path.includes(".mp4") || f.path.includes(".ts") || f.path.includes(".mov") || f.path.includes(".avi") || f.path.includes(".mxf")) {
                    // catVideoFile2.style.color = "Green"
                    catVideoFile2.classList.add("success-video")
                    if (catVideoFile2.classList.contains("failed-video")) {
                        catVideoFile2.classList.remove("failed-video")
                    }
                    catVideoFile2.innerHTML = f.path
                    
                } else {
                    catVideoFile2.innerHTML = "Must be a video files in mp4, mov, avi, or mxf format."
                    // catVideoFile2.style.color = "Red"
                    catVideoFile2.classList.add("failed-video")
                    if (catVideoFile2.classList.contains("success-video")) {
                        catVideoFile2.classList.remove("success-video")
                    }
                    return false;
                }
            }
        });
        catVid2.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        catInVid2.addEventListener('change', (e) => {
            if (catInVid2.files[0].path.includes(".mp4") || catInVid2.files[0].path.includes(".ts") || catInVid2.files[0].path.includes(".mov") || catInVid2.files[0].path.includes(".avi") || catInVid2.files[0].path.includes(".mxf")) {
                // catVideoFile2.style.color = "Green"
                catVideoFile2.classList.add("success-video")
                if (catVideoFile2.classList.contains("failed-video")) {
                    catVideoFile2.classList.remove("failed-video")
                }
                catVideoFile2.innerHTML = catInVid2.files[0].path
            } else {
                catVideoFile2.innerHTML = "Must be a video files in mp4, mov, ts, avi, or mxf format."
                // catVideoFile2.style.color = "Red"
                catVideoFile2.classList.add("failed-video")
                if (catVideoFile2.classList.contains("success-video")) {
                    catVideoFile2.classList.remove("success-video")
                }
                return false;
            }
        })

        catAud1.addEventListener('drop', (e) => {
            catAud1Input.files = e.dataTransfer.files
            e.preventDefault();
            e.stopPropagation();
            for (const f of e.dataTransfer.files) {
                console.log(f.path)
                if (f.path.includes(".aac") || f.path.includes(".wav") || f.path.includes(".mp3") || f.path.includes(".mp4")) {
                    // catAudioFile1.style.color = "Green"
                    catAudioFile1.classList.add("success-audio")
                    catAudioFile1.innerHTML = f.path
                } else {
                    catAudioFile1.innerHTML = "Must be an audio files in aac, wav, mp3, or mp4 format."
                    // catAudioFile1.style.color = "Red"
                    catAudioFile1.classList.add("failed-audio")
                    return false;
                }
            }
        });

        catAud1.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        catInAud1.addEventListener('change', (e) => {
            if (catInAud1.files[0].path.includes(".aac") || catInAud1.files[0].path.includes(".wav") || catInAud1.files[0].path.includes(".mp4") || catInAud1.files[0].path.includes(".mp3")) {
                // catAudioFile1.style.color = "Green"
                catAudioFile1.classList.add("success-audio")
                catAudioFile1.innerHTML = catInAud1.files[0].path
            } else {
                catAudioFile1.innerHTML = "Must be an audio files in aac, wav, mp3, or mp4 format."
                // catAudioFile1.style.color = "Red"
                catAudioFile1.classList.add("failed-audio")
                return false;
            }
        })

        catOutInput.addEventListener('change', (e) => {
            console.log("Changing output")
            catOut.innerHTML = catOutInput.files[0].path
        })

        muxVid1.addEventListener('drop', (e) => {
            muxVid1Input.files = e.dataTransfer.files
            e.preventDefault();
            e.stopPropagation();
            for (const f of e.dataTransfer.files) {
                if (f.path.includes(".wav") || f.path.includes(".aac") || f.path.includes(".mp3") ) {
                    // muxVideoFile1.style.color = "Green"
                    muxVideoFile1.innerHTML = "Must be a video file."
                    // muxVideoFile1.style.color = "Red"
                    muxVideoFile1.classList.add("failed-video")
                    if (muxVideoFile1.classList.contains("success-video")) {
                        muxVideoFile1.classList.remove("success-video")
                    }
                    return false;
                    
                } else {
                    muxVideoFile1.classList.add("success-video")
                    console.log(f)
                    muxVideoFile1.innerHTML = e.dataTransfer.files[0].path +"<br>"
                    const folders = /^.*\//gm;
                    muxOut.innerHTML = folders.exec(e.dataTransfer.files[0].path)
                    for (var i = 1; e.dataTransfer.files.length > i; i++) {
                        muxVideoFile1.innerHTML += e.dataTransfer.files[i].path+ "<br>"
                    }
                    if (muxVideoFile1.classList.contains("failed-video")) {
                        muxVideoFile1.classList.remove("failed-video")
                    }
                }


            }
        });
        muxVid1.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        muxInVid1.addEventListener('change', async (e) => {
            // for (const f of e.dataTransfer.files) {

            if (muxInVid1.files[0].path .includes(".wav") || muxInVid1.files[0].path .includes(".aac") || muxInVid1.files[0].path .includes(".mp3") ) {  
                
                muxVideoFile1.innerHTML = "Must be a video file."
                muxVideoFile1.classList.add("failed-video")
                if (muxVideoFile1.classList.contains("success-video")) {
                    muxVideoFile1.classList.remove("success-video")
                }
                return false;
            } else {
                muxVideoFile1.classList.add("success-video")
                if (muxVideoFile1.classList.contains("failed-video")) {
                    muxVideoFile1.classList.remove("failed-video")
                }
                muxVideoFile1.innerHTML = muxInVid1.files[0].path + "<br>"
                const folders = /^.*\//gm;
                muxOut.innerHTML = folders.exec(muxInVid1.files[0].path)
                for (var i = 1; muxInVid1.files.length > i; i++) {
                    muxVideoFile1.innerHTML += muxInVid1.files[i].path+ "<br>"
                }
            }
        // }
        })

        muxAud1.addEventListener('drop', (e) => {
            muxAud1Input.files = e.dataTransfer.files
            e.preventDefault();
            e.stopPropagation();
            muxAudioFile1.innerHTML = ''
            for (const f of e.dataTransfer.files) {
                console.log(f.path)
                // if (f.path.includes(".aac") || f.path.includes(".wav") || f.path.includes(".mp3") || f.path.includes(".mp4") || f.path.includes(".mov")) {
                    // if (f.length > 1){
                    //     for (var i = 0;f.length > 1; i++ ) {
                            muxAudioFile1.innerHTML += f.path + ',<br>'
                        // }}
                    // muxAudioFile1.innerHTML = f.path
                    muxAudioFile1.classList.add("success-audio")
                // } else {
                //     muxAudioFile1.innerHTML = "Must be an audio files in aac, wav, mp3, or mp4 format."
                //     muxAudioFile1.classList.add("failed-audio")
                //     return false;
                // }
            }
        });

        muxAud1.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        muxInAud1.addEventListener('change', (e) => {
            // if (muxInAud1.files[0].path.includes(".aac") || muxInAud1.files[0].path.includes(".wav") || muxInAud1.files[0].path.includes(".mp4") || muxInAud1.files[0].path.includes(".mp3") || muxInAud1.files[0].path.includes(".mov") || muxInAud1.files[0].path.includes(".mxf")) {
                // muxAudioFile1.style.color = "Green"
                muxAudioFile1.classList.add("success-audio")
                console.log(muxInAud1.files.length)
                muxAudioFile1.innerHTML = ''
                if (muxInAud1.files.length > 1){
                    for (var i = 0; muxInAud1.files.length > 1; i++ )
                    muxAudioFile1.innerHTML += muxInAud1.files[i].path + ',<br>'
                } else {
                muxAudioFile1.innerHTML = muxInAud1.files[0].path
                }
            // } else {
            //     muxAudioFile1.innerHTML = "Must be an audio files in aac, wav, mp3, or mp4 format."
            //     muxAudioFile1.classList.add("failed-audio")
            //     return false;
            // }
        })

        muxOutInput.addEventListener('change', (e) => {
            muxOut.innerHTML = muxOutInput.files[0].path
        })

        transVid1.addEventListener('drop', (e) => {
            transVid1Input.files = e.dataTransfer.files
            e.preventDefault();
            e.stopPropagation();
            for (const f of e.dataTransfer.files) {
                // if (f.path.includes(".mp4") || f.path.includes(".ts") || f.path.includes(".mkv") || f.path.path.includes(".h264")) {
                    // transVideoFile1.style.color = "Green"
                    if (transInVid1.files[0].path.includes(".mp4") || transInVid1.files[0].path.includes(".ts") || transInVid1.files[0].path.includes(".mkv") || transInVid1.files[0].path.includes(".h264") || transInVid1.files[0].path.includes(".mov") || transInVid1.files[0].path.includes(".mxf")) {
                    transVideoFile1.classList.add("success-video")
                    if (transVideoFile1.classList.contains("failed-video")) {
                        transVideoFile1.classList.remove("failed-video")
                    }

                    // transVideoFile1.innerHTML = f.path
                    transVideoFile1.innerHTML = e.dataTransfer.files[0].path +"<br>"
                    const folders = /^.*\//gm;
                    transOut.innerHTML = folders.exec(e.dataTransfer.files[0].path)
                    for (var i = 1; e.dataTransfer.files.length > i; i++) {
                        transVideoFile1.innerHTML += e.dataTransfer.files[i].path+ "<br>"
                    }
                    playTransVid1(f.path)
                } else {
                    transVideoFile1.innerHTML = "Must be a video file."
                    // transVideoFile1.style.color = "Red"
                    transVideoFile1.classList.add("failed-video")
                    if (transVideoFile1.classList.contains("success-video")) {
                        transVideoFile1.classList.remove("success-video")
                    }
                    return false;
                }


            }
        });
        transVid1.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        transInVid1.addEventListener('change', (e) => {
            if (transInVid1.files[0].path.includes(".mp4") || transInVid1.files[0].path.includes(".ts") || transInVid1.files[0].path.includes(".mkv") || transInVid1.files[0].path.includes(".h264") || transInVid1.files[0].path.includes(".mov") || transInVid1.files[0].path.includes(".mxf")) {
                // transVideoFile1.style.color = "Green"
                transVideoFile1.classList.add("success-video")
                if (transVideoFile1.classList.contains("failed-video")) {
                    transVideoFile1.classList.remove("failed-video")
                }
                transVideoFile1.innerHTML = transInVid1.files[0].path + "<br>"
                const folders = /^.*\//gm;
                transOut.innerHTML = folders.exec(transInVid1.files[0].path)
                for (var i = 1; transInVid1.files.length > i; i++) {
                    transVideoFile1.innerHTML += transInVid1.files[i].path+ "<br>"
                }
                // transVideoFile1.innerHTML = transInVid1.files[0].path
            } else {
                transVideoFile1.innerHTML = "Must be a video file."
                // transVideoFile1.style.color = "Red"
                transVideoFile1.classList.add("failed-video")
                if (transVideoFile1.classList.contains("success-video")) {
                    transVideoFile1.classList.remove("success-video")
                }
                return false;
            }
        })

        transAud1.addEventListener('drop', (e) => {
            transAud1Input.files = e.dataTransfer.files
            e.preventDefault();
            e.stopPropagation();
            for (const f of e.dataTransfer.files) {
                console.log(f.path)
                if (f.path.includes(".aac") || f.path.includes(".wav") || f.path.includes(".mp3") || f.path.includes(".mp4")) {
                    // transAudioFile1.style.color = "Green"
                    transAudioFile1.classList.add("success-audio")
                    if (transAudioFile1.classList.contains("failed-video")) {
                        transAudioFile1.classList.remove("failed-video")
                    }
                    transAudioFile1.innerHTML = f.path
                } else {
                    transAudioFile1.innerHTML = "Must be an audio files in aac, wav, mp3, or mp4 format."
                    // transAudioFile1.style.color = "Red"
                    transAudioFile1.classList.add("failed-audio")
                    if (transAudioFile1.classList.contains("success-video")) {
                        transAudioFile1.classList.remove("success-video")
                    }
                    return false;
                }
            }
        });

        transAud1.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        transInAud1.addEventListener('change', (e) => {
            if (transInAud1.files[0].path.includes(".aac") || transInAud1.files[0].path.includes(".wav") || transInAud1.files[0].path.includes(".mp4") || transInAud1.files[0].path.includes(".mp3")) {
                // transAudioFile1.style.color = "Green"
                transAudioFile1.classList.add("success-audio")
                if (transAudioFile1.classList.contains("failed-video")) {
                    transAudioFile1.classList.remove("failed-video")
                }
                transAudioFile1.innerHTML = transInAud1.files[0].path
            } else {
                transAudioFile1.innerHTML = "Must be an audio files in aac, wav, mp3, or mp4 format."
                // transAudioFile1.style.color = "Red"
                transAudioFile1.classList.add("failed-audio")
                if (transAudioFile1.classList.contains("success-video")) {
                    transAudioFile1.classList.remove("success-video")
                }
                return false;
            }
        })

        transOutInput.addEventListener('change', (e) => {
            transOut.innerHTML = transOutInput.files[0].path
        })

        dstreamOutInput.addEventListener('change', (e) => {
            dstreamOut.innerHTML = dstreamOutInput.files[0].path
            
        })

        minButton.addEventListener("click", event => {
            window = remote.getCurrentWindow();
            window.minimize();
        });

        maxButton.addEventListener("click", event => {
            window = remote.getCurrentWindow();
            if (window.isMaximized()) {
                window.unmaximize();
            } else {
                window.maximize();
            }
        });

        closeButton.addEventListener("click", event => {
            window = remote.getCurrentWindow();
            window.close();
        });

        function toggleMaxRestoreButtons() {
            window = remote.getCurrentWindow();
            if (window.isMaximized()) {
                maxButton.style.display = "none";
                restoreButton.style.display = "flex";
            } else {
                // restoreButton.style.display = "none";
                maxButton.style.display = "flex";
            }
        }
    }


})();