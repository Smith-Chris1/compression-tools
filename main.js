'use strict';

// var { app, BrowserWindow } = require('electron')
const {
    app,
    BrowserWindow
} = require('electron');
const {
    ipcMain
} = require('electron');

// var promise = require('promise');
// var async = require('asyncawait/async');
// var await = require('asyncawait/await');
// const util = require('util');

var path = require("path");
var fs = require('fs');
var os = require('os');
var ffmpegPath = require("./config.js").ffmpegPath;
var ffprobePath = require("./config.js").ffprobePath;
var youtubedl = require('youtube-dl-exec')
var spawn = require('child_process').spawn;
// var spawn = require('child_process').spawnSync;
var rimraf = require('rimraf');
var url = require('url');
var killAll = require('tree-kill');
var Progress = require('progress-stream');


let killsignal = false
var progressQuotes = [
    'Growing trees...',
    'Watching paint dry...',
    'Going to lunch...',
    'Bueller, Bueller...',
    'What is my purpose..',
    'Why does this take so long?',
    'This might take a while...',
    'I think this is working...',
    'Hopefully the progressbar is working...',
    'Please be patient',
    'ffmpeg is mostly awesome...',
    'You should take a break...',
    'This is a montage...',
    'I got this...',
    'Its under control...',
    'Things are on fire...',
    'Why would you do this to me?',
    'Cant wait until this is over.',
    'Need more puns...',
    'My leaf blower doesn’t work. It sucks.',
    'I like bowling.',
    'I need more hobbies',
    'Have you seen all these yet?',
    'They\'ve gone to plad.',
    'We\'re at now, now',
    'What happened to then?',
    'We just passed it. When? Just now.',
    'Yippi Kayak Mother Bucket',
    'I\'ll be back',
    'Why so serious?',
    'We\'re gonna need a bigger boat.',
    'To infinity! And Beyond!',
    'I see dead people',
    'Hasta la vista, baby.',
    'My precious',
    'I am your father',
    'This... is... Sparta!!',
    'I am serious, and don\'t call me Shirley'

]


let mainWindow;


function createWindow() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 770,
        height: 485,
        frame: false,
        webPreferences: {
            nodeIntegration: true,

        },
        icon: path.join(__dirname, '/app/icons/mac/icon.icns')
        // ELECTRON_DISABLE_SECURITY_WARNINGS: true,
        // backgroundColor: '#FFF',
        // webPreferences: {
        //     nodeIntegration: true
        // }
    });

    // and load the index.html of the app.
    // mainWindow.loadFile('file://' + __dirname + './app/index.html');
    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('trans-file-1', function (event, data) {
    console.log(data)
    // var mc = new MediaConverter({ videoFormats: ['webm'] });
    fs.mkdtemp(path.join(os.tmpdir(), 'foo-'), (err, tmpFolder) => {
        // mc.convert(data, "480x240", tmpFolder)

        // function proxy1(cmd, callback) {
        //     var result = '';
        //     cmd.stdout.on('data', function (data) {
        //         result += data.toString();
        //     });
        //     cmd.on('close', function (code) {
        //         return callback(JSON.parse(result))
        //     })
        // };

        let proxy1 = spawn(ffmpegPath, ['-hide_banner', '-i', data, '-hls_time', '10', '-y', path.normalize(tmpFolder + "/" + path.basename(data).split(".")[0] + ".m3u8")])

        proxy1.stderr.on('data', (err) => {
            console.log(err.toString())

        })
        setTimeout(function () {
            mainWindow.webContents.send('vid1-file', path.normalize(tmpFolder + "/" + path.basename(data).split(".")[0] + ".m3u8"))
        }, 2000)

    })

})


ipcMain.on('submitCatForm', function (event, data) {

    fs.mkdtemp(path.join(os.tmpdir(), 'foo-'), (err, tmpFolder) => {
        if (err) throw err;
        console.log(tmpFolder);
        console.log(data)
        let ffprobe = spawn(ffprobePath, ['-hide_banner', '-i', data.vid1, '-show_format', '-show_streams', '-of', 'json'])

        function probeRun(cmd, callback) {
            var result = '';
            cmd.stdout.on('data', function (data) {
                result += data.toString();
            });
            cmd.on('close', function (code) {
                return callback(JSON.parse(result));
            });
        }

        function tempSlate(cmd, callback) {
            var result = '';
            cmd.stdout.on('data', function (data) {
                result += data.toString();
            });
            cmd.on('close', function (code) {
                return callback(JSON.parse(result))
            })
        };

        function probeParse(result, callback) {
            // let probeResults = JSON.parse(result)
        }

        if (data.vid1.includes(".ts")) {
            probeRun(ffprobe, function (probeResults) {
                // console.log(probeResults)
                let tempslate = spawn(ffmpegPath, ['-hide_banner', '-i', data.vid2, '-s', probeResults.streams[0].width + 'x' + probeResults.streams[0].height, '-an', '-c:v', 'libx264', '-b:v', probeResults.format.bit_rate, '-profile:v', probeResults.streams[0].profile, '-level:v', probeResults.streams[0].level, '-pix_fmt', probeResults.streams[0].pix_fmt, '-framerate', probeResults.streams[0].r_frame_rate, '-refs', '1', '-x264opts', 'b-pyramid=0', '-copyts', '-vsync', '0', '-tag:v', 'avc1', '-mpegts_start_pid', probeResults.streams[0].id, '-vbsf', 'h264_mp4toannexb', '-flags', '-global_header', '-f', 'mpegts', '-y', path.normalize(tmpFolder + "/" + path.basename(data.vid1).split(".")[0] + "_tempSlate.ts")])
                // console.log(tempslate)
                tempslate.on('exit', (statusCode) => {
                    if (statusCode === 0) {
                        // console.log('conversion successful ' + tmpFolder + "/" + path.basename(data.vid1).split(".")[0] + "_tempSlate.ts")

                        if (data.audio == "None") {
                            var ffmpegConcatCode = spawn(ffmpegPath, ['-i', 'concat:' + data.vid1 + '|' + path.normalize(tmpFolder + '/' + path.basename(data.vid1).split('.')[0] + '_tempSlate.ts'), '-c', 'copy', '-y', path.normalize(data.output + "/" + path.basename(data.vid1).split(".")[0] + "_merged.mp4")]);
                        } else {
                            if (data.audio.includes('.aac') || data.audio.includes('.mp3') || data.audio.includes('.mp4')) {
                                var ffmpegConcatCode = spawn(ffmpegPath, ['-i', 'concat:' + data.vid1 + '|' + path.normalize(tmpFolder + '/' + path.basename(data.vid1).split('.')[0] + '_tempSlate.ts'), '-i', data.audio, '-c', 'copy', '-map', '0:v', '-map', '1:a', '-y', path.normalize(data.output + "/" + path.basename(data.vid1).split(".")[0] + "_merged.mp4")]);
                            } else {
                                var ffmpegConcatCode = spawn(ffmpegPath, ['-i', 'concat:' + data.vid1 + '|' + path.normalize(tmpFolder + '/' + path.basename(data.vid1).split('.')[0] + '_tempSlate.ts'), '-i', data.audio, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-map', '0:v', '-map', '1:a', '-y', path.normalize(data.output + "/" + path.basename(data.vid1).split(".")[0] + "_merged.mp4")]);
                            }
                        }
                        // console.log(ffmpegConcatCode)
                        let ffmpegConcat = ffmpegConcatCode
                        ipcMain.on("killCat", function () {
                            if (ffmpegConcat) {
                                ffmpegConcat.kill();
                            }
                        })

                        ffmpegConcat.on('exit', (statusCode) => {
                            // if (statusCode === 0) {
                            //     // console.log('conversion successful')
                            //     // fs.rmdir(tmpFolder)
                            //     mainWindow.webContents.send('cat-status', 'done')
                            //     mainWindow.webContents.send('trans-progress', '100%')
                            //     rimraf(tmpFolder, function () {
                            //         // console.log("done");
                            //     });
                            // }

                            if (statusCode === 0) {
                                mainWindow.webContents.send('cat-status', 'Done')
                                mainWindow.webContents.send('cat-progress', '100%')
                                mainWindow.webContents.send('cat-done', path.normalize(data.output + "/" + path.basename(data.vid1).split(".")[0] + "_merged.mp4"))
                                rimraf(tmpFolder, function () {});
                            }
                            if (statusCode === 255) {
                                mainWindow.webContents.send('cat-status', 'Cancelled')
                                mainWindow.webContents.send('cat-sub', '<small>You gave up, not me.</small>')
                                rimraf(tmpFolder, function () {});
                            }
                        })
                        ffmpegConcat
                            .stderr.on('data', (err) => {
                                // console.log(new String(err))
                                if (err.includes('time=')) {
                                    // console.log(new String(err).split('time=')[1].split(' ')[0])
                                    mainWindow.webContents.send('cat-progress', Math.floor(Math.floor(Number(new String(err).split('time=')[1].split(' ')[0].split(":")[0] * 60 * 60) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1]) * 60 + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[2]) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1] * (1 / parseInt(probeResults.streams[0].r_frame_rate)))) / probeResults.streams[0].duration * 100) + "%")
                                    // mainWindow.webContents.send('cat-progress', new String(err).split('time=')[1].split(' ')[0])
                                    // console.log()
                                    // } else {
                                    var randomNumber = Math.floor(Math.random() * progressQuotes.length)
                                    console.log(progressQuotes[randomNumber])

                                    mainWindow.webContents.send('cat-status', 'Merging mp4... ')
                                    mainWindow.webContents.send('cat-sub', '<small>' + progressQuotes[randomNumber] + '</small>')

                                }
                            })
                    }
                });
                tempslate.stderr.on('data', (err) => {
                    // console.log(new String(err))
                    if (err.includes('time=')) {
                        console.log(new String(err).split('time=')[1].split(' ')[0])
                        mainWindow.webContents.send('cat-progress', Math.floor(Math.floor(Number(new String(err).split('time=')[1].split(' ')[0].split(":")[0] * 60 * 60) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1]) * 60 + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[2]) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1] * (1 / parseInt(probeResults.streams[0].r_frame_rate)))) / probeResults.streams[0].duration * 100) + "%")
                        // mainWindow.webContents.send('cat-progress', new String(err).split('time=')[1].split(' ')[0])
                        // } else {
                        var randomNumber = Math.floor(Math.random() * progressQuotes.length)
                        // console.log(progressQuotes[randomNumber])
                        mainWindow.webContents.send('cat-status', "Making slate...")
                        mainWindow.webContents.send('cat-sub', '<small>' + progressQuotes[randomNumber] + '</small>')

                    }
                })
            });
        } else {
            probeRun(ffprobe, function (probeResults) {
                let ffmpeg = spawn(ffmpegPath, ['-i', data.vid1, '-c', 'copy', '-f', 'mpegts', '-y', path.normalize(tmpFolder + "/" + path.basename(data.vid1).split(".")[0] + "_tstemp.ts")]);
                ffmpeg.on('exit', (statusCode) => {
                    if (statusCode === 0) {
                        console.log('conversion successful')
                        let ffprobe = spawn(ffprobePath, ['-hide_banner', '-i', path.normalize(tmpFolder + "/" + path.basename(data.vid1).split(".")[0] + "_tstemp.ts"), '-show_format', '-show_streams', '-of', 'json'])
                        probeRun(ffprobe, function (probeResults) {
                            console.log(probeResults)
                            let tempslate = spawn(ffmpegPath, ['-hide_banner', '-i', data.vid2, '-s', probeResults.streams[0].width + 'x' + probeResults.streams[0].height, '-an', '-c:v', 'libx264', '-b:v', probeResults.format.bit_rate, '-profile:v', probeResults.streams[0].profile, '-level:v', probeResults.streams[0].level, '-pix_fmt', probeResults.streams[0].pix_fmt, '-framerate', probeResults.streams[0].r_frame_rate, '-refs', '1', '-x264opts', 'b-pyramid=0', '-copyts', '-vsync', '0', '-tag:v', 'avc1', '-mpegts_start_pid', probeResults.streams[0].id, '-vbsf', 'h264_mp4toannexb', '-flags', '-global_header', '-f', 'mpegts', '-y', path.normalize(tmpFolder + "/" + path.basename(data.vid1).split(".")[0] + "_tempSlate.ts")])
                            ipcMain.on("killCat", function () {
                                if (tempslate) {
                                    tempslate.kill();
                                }
                            })
                            tempslate.on('exit', (statusCode) => {
                                if (statusCode === 0) {
                                    console.log('conversion successful ' + path.normalize(tmpFolder + "/" + path.basename(data.vid1).split(".")[0] + "_tempSlate.ts"))
                                    // let ffmpegConcat = spawn(ffmpegPath, ['-i', 'concat:' + tmpFolder + "/" + path.basename(data.vid1).split(".")[0] + "_tstemp.ts" + '|' + tmpFolder + '/' + path.basename(data.vid1).split('.')[0] + '_tempSlate.ts', '-c', 'copy', '-y', data.output + "/" + path.basename(data.vid1).split(".")[0] + "_merged.mp4"]);
                                    if (data.audio == "None") {
                                        var ffmpegConcatCode = spawn(ffmpegPath, ['-i', 'concat:' + path.normalize(tmpFolder + "/" + path.basename(data.vid1).split(".")[0] + "_tstemp.ts") + '|' + path.normalize(tmpFolder + '/' + path.basename(data.vid1).split('.')[0] + '_tempSlate.ts'), '-c', 'copy', '-y', path.normalize(data.output + "/" + path.basename(data.vid1).split(".")[0] + "_merged.mp4")]);
                                    } else {
                                        if (data.audio.includes('.acc') || data.audio.includes('.mp3') || data.audio.includes('.mp4')) {
                                            var ffmpegConcatCode = spawn(ffmpegPath, ['-i', 'concat:' + path.normalize(tmpFolder + "/" + path.basename(data.vid1).split(".")[0] + "_tstemp.ts") + '|' + path.normalize(tmpFolder + '/' + path.basename(data.vid1).split('.')[0] + '_tempSlate.ts'), '-i', data.audio, '-c', 'copy', '-map', '0:v', '-map', '1:a', '-y', path.normalize(data.output + "/" + path.basename(data.vid1).split(".")[0] + "_merged.mp4")]);
                                        } else {
                                            var ffmpegConcatCode = spawn(ffmpegPath, ['-i', 'concat:' + path.normalize(tmpFolder + "/" + path.basename(data.vid1).split(".")[0] + "_tstemp.ts") + '|' + path.normalize(tmpFolder + '/' + path.basename(data.vid1).split('.')[0] + '_tempSlate.ts'), '-i', data.audio, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-map', '0:v', '-map', '1:a', '-y', path.normalize(data.output + "/" + path.basename(data.vid1).split(".")[0] + "_merged.mp4")]);
                                        }
                                    }
                                    // console.log(ffmpegConcatCode)
                                    let ffmpegConcat = ffmpegConcatCode
                                    ipcMain.on("killCat", function () {
                                        if (ffmpegConcat) {
                                            ffmpegConcat.kill();
                                        }
                                    })
                                    ffmpegConcat.on('exit', (statusCode) => {
                                        // if (statusCode === 0) {
                                        //     // console.log('conversion successful')
                                        //     // fs.rmdir(tmpFolder)
                                        //     mainWindow.webContents.send('cat-status', 'done')
                                        //     mainWindow.webContents.send('trans-progress', '100%')
                                        //     rimraf(tmpFolder, function () {
                                        //         console.log("done");
                                        //     });
                                        // }

                                        if (statusCode === 0) {
                                            mainWindow.webContents.send('cat-status', 'Done')
                                            mainWindow.webContents.send('cat-progress', '100%')
                                            mainWindow.webContents.send('cat-done', path.normalize(data.output + "/" + path.basename(data.vid1).split(".")[0] + "_merged.mp4"))
                                            rimraf(tmpFolder, function () {});
                                        }
                                        if (statusCode === 255) {
                                            mainWindow.webContents.send('cat-status', 'Cancelled')
                                            mainWindow.webContents.send('cat-sub', '<small>You gave up, not me.</small>')
                                            rimraf(tmpFolder, function () {});
                                        }
                                    })
                                    ffmpegConcat
                                        .stderr.on('data', (err) => {
                                            if (err.includes('time=')) {
                                                // console.log(new String(err).split('time=')[1].split(' ')[0])
                                                mainWindow.webContents.send('cat-progress', Math.floor(Math.floor(Number(new String(err).split('time=')[1].split(' ')[0].split(":")[0] * 60 * 60) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1]) * 60 + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[2]) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1] * (1 / parseInt(probeResults.streams[0].r_frame_rate)))) / probeResults.streams[0].duration * 100) + "%")
                                                // mainWindow.webContents.send('cat-progress', new String(err).split('time=')[1].split(' ')[0])
                                                // console.log()
                                                // } else {
                                                var randomNumber = Math.floor(Math.random() * progressQuotes.length)
                                                // console.log(progressQuotes[randomNumber])

                                                mainWindow.webContents.send('cat-status', 'Merging mp4...')
                                                mainWindow.webContents.send('cat-sub', '<small>' + progressQuotes[randomNumber] + '</small>')

                                            }
                                        })
                                }
                            })
                            tempslate.stderr.on('data', (err) => {
                                if (err.includes('time=')) {
                                    // console.log(new String(err).split('time=')[1].split(' ')[0])
                                    mainWindow.webContents.send('cat-progress', Math.floor(Math.floor(Number(new String(err).split('time=')[1].split(' ')[0].split(":")[0] * 60 * 60) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1]) * 60 + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[2]) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1] * (1 / parseInt(probeResults.streams[0].r_frame_rate)))) / probeResults.streams[0].duration * 100) + "%")
                                    // mainWindow.webContents.send('cat-progress', new String(err).split('time=')[1].split(' ')[0])
                                    // } else {
                                    var randomNumber = Math.floor(Math.random() * progressQuotes.length)
                                    // console.log(progressQuotes[randomNumber])
                                    mainWindow.webContents.send('cat-status', "Making slate...")
                                    mainWindow.webContents.send('cat-sub', '<small>' + progressQuotes[randomNumber] + '</small>')

                                }
                            })
                        })
                    }
                })
                ffmpeg.stderr.on('data', (err) => {
                    if (err.includes('time=')) {
                        // console.log(new String(err).split('time=')[1].split(' ')[0])
                        // console.log(Math.floor(Number(new String(err).split('time=')[1].split(' ')[0].split(":")[0]*60*60) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1])*60 + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[2]) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1]))/probeResults.streams[0].duration)
                        mainWindow.webContents.send('cat-progress', Math.floor(Math.floor(Number(new String(err).split('time=')[1].split(' ')[0].split(":")[0] * 60 * 60) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1]) * 60 + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[2]) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1] * (1 / parseInt(probeResults.streams[0].r_frame_rate)))) / probeResults.streams[0].duration * 100) + "%")
                        // mainWindow.webContents.send('cat-progress', new String(err).split('time=')[1].split(' ')[0])
                        // } else {
                        var randomNumber = Math.floor(Math.random() * progressQuotes.length)
                        // console.log(progressQuotes[randomNumber])
                        mainWindow.webContents.send('cat-status', 'Creating temp file... ')
                        mainWindow.webContents.send('cat-sub', '<small>' + progressQuotes[randomNumber] + '</small>')

                    }
                })
            })

        }
    });
});

ipcMain.on('submitmuxForm', function (event, data) {
    console.log("muxing")
    fs.mkdtemp(path.join(os.tmpdir(), 'foo-'), (err, tmpFolder) => {
        if (err) throw err;
        console.log(tmpFolder);
        console.log(data)
        console.log(data.audio)
        let ffprobe = spawn(ffprobePath, ['-hide_banner', '-i', data.vid1[0], '-show_format', '-show_streams', '-of', 'json'])

        function probeRun(cmd, callback) {
            var result = '';
            cmd.stdout.on('data', function (data) {
                result += data.toString();
            });
            cmd.on('close', function (code) {
                return callback(JSON.parse(result));
            });
        }

        function probeParse(result, callback) {
            // let probeResults = JSON.parse(result)
        }
        probeRun(ffprobe, function (probeResults) {
        let videos = data.vid1.filter(function (el) {
            return el != null;
          });
        console.log(videos)
        for (var i = 0; videos.length > i; i++) {
            let videoTrack = videos[i]
            if (videoTrack.length > 3) {
                let audio = data.audio.split('<br>')[0].replace(",","")
                var ffmpegMuxCode = []
                // console.log(data.vid1.length)
                if (audio.includes('.aac') || audio.includes('.mp4')) {
                    ffmpegMuxCode.push('-i', videoTrack, '-i', audio, '-c', 'copy', '-map', '0:v', '-map', '1:a', '-y', path.normalize(data.output + "/" + path.basename(videoTrack).split(".")[0] + "-muxed." + path.basename(videoTrack).split(".")[1]));
                } else {
                    if (audio.includes('.wav') || audio.includes('.mp3')) {
                        ffmpegMuxCode.push('-i', videoTrack, '-i', audio, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-map', '0:v', '-map', '1:a', '-y', path.normalize(data.output + "/" + path.basename(videoTrack).split(".")[0] + "-muxed." + path.basename(videoTrack).split(".")[1]));
                    } else {
                        ffmpegMuxCode.push('-i', videoTrack, '-i', audio, '-c', 'copy', '-map', '0:v', '-map', '1:a', '-y', path.normalize(data.output + "/" + path.basename(videoTrack).split(".")[0] + "-muxed." + path.basename(videoTrack).split(".")[1]));
                    }
                }
                console.log(ffmpegPath)
                console.log(ffmpegMuxCode)
                let ffmpegMux = spawn(ffmpegPath, ffmpegMuxCode)
                // console.log(ffmpegMux.)
                ipcMain.on("killMux", function () {
                    if (ffmpegMux) {
                        ffmpegMux.kill();
                    }
                })

                ffmpegMux.on('error', (err) => {
                    console.log(err)
                })

                ffmpegMux.on('exit', (statusCode) => {
                    if (statusCode === 0) {
                        mainWindow.webContents.send('mux-status', 'Done')
                        mainWindow.webContents.send('mux-progress', '100%')
                        if (i === videos.length) {
                            mainWindow.webContents.send('mux-done', 'Your files are now muxed.')
                            }
                        rimraf(tmpFolder, function () {});
                    }
                    if (statusCode === 255) {
                        mainWindow.webContents.send('mux-status', 'Cancelled')
                        mainWindow.webContents.send('mux-sub', '<small>You gave up, not me.</small>')
                        rimraf(tmpFolder, function () {});
                    }
                })

                ffmpegMux.stderr.on('data', (err) => {
                    if (err.includes('time=')) {
                        mainWindow.webContents.send('mux-progress', Math.floor(Math.floor(Number(new String(err).split('time=')[1].split(' ')[0].split(":")[0] * 60 * 60) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1]) * 60 + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[2]) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1] * (1 / parseInt(probeResults.streams[0].r_frame_rate)))) / probeResults.streams[0].duration * 100) + "%")
                        var randomNumber = Math.floor(Math.random() * progressQuotes.length)
                        mainWindow.webContents.send('mux-status', 'Muxing audio... ')
                        mainWindow.webContents.send('mux-sub', '<small>' + progressQuotes[randomNumber] + '</small>')
                    
                    }
                }) 
            }       
        }  
    }) 
    })
});

ipcMain.on('submitTransForm', function (event, data) {
    console.log("transcoding")
    const data1 = data
    fs.mkdtemp(path.join(os.tmpdir(), 'foo-'), (err, tmpFolder) => {
        if (err) throw err;
        console.log(tmpFolder);
        console.log(data)
        let vidNum = 0
        ffmpegBuildCode(data,vidNum)
        // console.log(ffprobe)
    })})
        function ffmpegBuildCode(data,vidNum) {
console.log(vidNum)
console.log(data)
        function probeRun(cmd, callback) {
            var result = '';
            cmd.stdout.on('data', function (data) {
                result += data.toString();
            });
            cmd.on('close', function (code) {
                return callback(JSON.parse(result));
            });
        }
        var videos = data.vid1.filter(function (el) {
            return el != null;
          });
        console.log(videos.length)
        // videos.forEach(async video => {
        // for (var i = 0; videos.length > i; i++) {
            // console.log(videos[i])
            let video = videos[vidNum]
            if (video != undefined) {
        var ffprobeCode = []
        if (video != "None") {
            ffprobeCode.push('-hide_banner', '-i', video, '-show_format', '-show_streams', '-of', 'json')
        } else {
            ffprobeCode.push('-hide_banner', '-i', data.audio, '-show_format', '-show_streams', '-of', 'json')
        }
        let ffprobe = spawn(ffprobePath, ffprobeCode)
        // if (data.vid1.includes(".ts")) {
            
        probeRun(ffprobe,  function (probeResults) {
            
            var ffmpegTransCode = ['-hide_banner']
            var ffmpegTransCode2 = ['-hide_banner']
            // var audioSettings = []
            if (data.vid1 != "None") {
                ffmpegTransCode.push('-i', video)
            }
            if (data.audio != "None") {
                ffmpegTransCode.push('-i', data.audio)
                // ffmpegTransCode.push(data.audio)
                // audioSettings.push('-map', '0:v', '-map', '1:a')
                var audioSettings = "'-map', '0:v', '-map', '1:a'"
            }
            if (data.highQuality == true) {
                if (data.vid1 != "None") {
                    ffmpegTransCode2.push('-i', video)
                }
                if (data.audio != "None") {
                    ffmpegTransCode2.push('-i', data.audio)
                }
            }
            if (data.video1080p == true && videos[vidNum] != "None") {
                ffmpegTransCode.push('-c:v', 'libx264', '-b:v', '4M', '-s', '1920x1080', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '320k')
                ffmpegTransCode2.push('-c:v', 'libx264', '-b:v', '4M', '-s', '1920x1080', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '320k')
                if (data.audio != "None") {
                    ffmpegTransCode.push('-map', '0:v', '-map', '1:a')
                    ffmpegTransCode2.push('-map', '0:v', '-map', '1:a')
                    if (data.highQuality != true) {
                        ffmpegTransCode.push('-y', path.normalize(data.output + "/" + path.basename(video).split('.')[0] + "-1080p.mp4"))
                        // ffmpegTransCode2.push('-c:v', 'libx264', '-b:v', '4M', '-s', '1920x1080', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '320k', '-map', '0:v', '-map', '1:a', '-pass', '2', '-y', path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "-1080p.mp4"))
                    } else {
                        ffmpegTransCode.push('-pass', '1', '-passlogfile', path.normalize(data.output + '/1080.log'), '-f', 'mp4', '/dev/null')
                        ffmpegTransCode2.push('-pass', '2', '-passlogfile', path.normalize(data.output + '/1080.log'), '-y', path.normalize(data.output + "/" + path.basename(video).split('.')[0] + "-1080p.mp4"))
                    }
                } else {
                    if (data.highQuality != true) {
                        ffmpegTransCode.push('-y', path.normalize(data.output + "/" + path.basename(video).split('.')[0] + "-1080p.mp4"))
                        // ffmpegTransCode2.push('-c:v', 'libx264', '-b:v', '4M', '-s', '1920x1080', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '320k', '-map', '0:v', '-map', '1:a', '-pass', '2', '-y', path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "-1080p.mp4"))
                    } else {
                        ffmpegTransCode.push('-pass', '1', '-passlogfile', path.normalize(data.output + '/1080.log'), '-y', '-f', 'mp4', '/dev/null')
                        ffmpegTransCode2.push('-pass', '2', '-passlogfile', path.normalize(data.output + '/1080.log'), '-y', path.normalize(data.output + "/" + path.basename(video).split('.')[0] + "-1080p.mp4"))
                    }
                    // ffmpegTransCode.push('-y', path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "-1080p.mp4"))
                }
            }

            if (data.video720p == true && video != "None") {
                ffmpegTransCode.push('-c:v', 'libx264', '-b:v', '1.8M', '-s', '1280x720', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k')
                ffmpegTransCode2.push('-c:v', 'libx264', '-b:v', '1.8M', '-s', '1280x720', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k')
                if (data.audio != "None") {
                    ffmpegTransCode.push('-map', '0:v', '-map', '1:a')
                    ffmpegTransCode2.push('-map', '0:v', '-map', '1:a')
                    if (data.highQuality != true) {
                        ffmpegTransCode.push('-y', path.normalize(data.output + "/" + path.basename(data.audio).split('.')[0] + "-720p.mp4"))
                    } else {
                        ffmpegTransCode.push('-pass', '1', '-passlogfile', path.normalize(data.output + '/720.log'), '-f', 'mp4', '/dev/null')
                        ffmpegTransCode2.push('-pass', '2', '-passlogfile', path.normalize(data.output + '/720.log'), '-y', path.normalize(data.output + "/" + path.basename(video).split('.')[0] + "-720p.mp4"))
                    }
                } else {
                    if (data.highQuality != true) {
                        console.log(vidNum)
                        console.log(videos[vidNum])
                        console.log(video)
                        ffmpegTransCode.push('-y', path.normalize(data.output + "/" + path.basename(video).split('.')[0] + "-720p.mp4"))
                    } else {
                        ffmpegTransCode.push('-pass', '1', '-passlogfile', path.normalize(data.output + '/720.log'), '-y', '-f', 'mp4', '/dev/null')
                        ffmpegTransCode2.push('-pass', '2', '-passlogfile', path.normalize(data.output + '/720.log'), '-y', path.normalize(data.output + "/" + path.basename(video).split('.')[0] + "-720p.mp4"))
                    }
                    // ffmpegTransCode.push('-y', path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "-1080p.mp4"))
                }
            }


            if (data.video360p == true && video != "None") {
                ffmpegTransCode.push('-c:v', 'libx264', '-b:v', '1M', '-s', '640x360', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k')
                ffmpegTransCode2.push('-c:v', 'libx264', '-b:v', '1M', '-s', '640x360', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k')
                if (data.audio != "None") {
                    ffmpegTransCode.push('-map', '0:v', '-map', '1:a')
                    ffmpegTransCode2.push('-map', '0:v', '-map', '1:a')
                    if (data.highQuality != true) {
                        ffmpegTransCode.push('-y', path.normalize(data.output + "/" + path.basename(video).split('.')[0] + "-360p.mp4"))
                    } else {
                        ffmpegTransCode.push('-pass', '1', '-passlogfile', path.normalize(data.output + '/360.log'), '-f', 'mp4', '/dev/null')
                        ffmpegTransCode2.push('-pass', '2', '-passlogfile', path.normalize(data.output + '/360.log'), '-y', path.normalize(data.output + "/" + path.basename(video).split('.')[0] + "-360p.mp4"))
                    }
                } else {
                    if (data.highQuality != true) {
                        ffmpegTransCode.push('-y', path.normalize(data.output + "/" + path.basename(video).split('.')[0] + "-360p.mp4"))
                    } else {
                        ffmpegTransCode.push('-pass', '1', '-passlogfile', path.normalize(data.output + '/360.log'), '-y', '-f', 'mp4', '/dev/null')
                        ffmpegTransCode2.push('-pass', '2', '-passlogfile', path.normalize(data.output + '/360.log'), '-y', path.normalize(data.output + "/" + path.basename(video).split('.')[0] + "-360p.mp4"))
                    }
                }
            }

            if (data.audio320k == true && video != "None") {
                ffmpegTransCode.push('-c:a', 'aac', '-b:a', '320k')
                if (data.audio != "None" && video != "None") {
                    ffmpegTransCode.push('-map', '1:a', '-y', path.normalize(data.output + "/" + path.basename(data.audio).split('.')[0] + "-320k.aac"))
                } else {
                    ffmpegTransCode.push('-y', path.normalize(data.output + "/" + path.basename(video).split('.')[0] + "-320k.aac"))
                }
            } else if (data.audio320k == true) {
                ffmpegTransCode.push('-c:a', 'aac', '-b:a', '320k', '-y', path.normalize(data.output + "/" + path.basename(data.audio).split('.')[0] + "-320k.aac"))
            }
            if (data.audio128k == true && video != "None") {
                ffmpegTransCode.push('-c:a', 'aac', '-b:a', '128k')
                if (data.audio != "None") {
                    ffmpegTransCode.push('-map', '1:a', '-y', path.normalize(data.output + "/" + path.basename(data.audio).split('.')[0] + "-128k.aac"))
                } else {
                    ffmpegTransCode.push('-y', path.normalize(data.output + "/" + path.basename(video).split('.')[0] + "-128k.aac"))
                }
            } else if (data.audio128k == true) {
                ffmpegTransCode.push('-c:a', 'aac', '-b:a', '128k', '-y', path.normalize(data.output + "/" + path.basename(data.audio).split('.')[0] + "-128k.aac"))
            }
            if (data.audio32k == true && video != "None") {
                ffmpegTransCode.push('-c:a', 'mp3', '-b:a', '32k')
                if (data.audio != "None") {
                    ffmpegTransCode.push('-map', '1:a', '-y', path.normalize(data.output + "/" + path.basename(data.audio).split('.')[0] + "-32k.mp3"))
                } else {
                    ffmpegTransCode.push('-y', path.normalize(data.output + "/" + path.basename(video).split('.')[0] + "-32k.mp3"))
                }
            } else if (data.audio32k == true) {
                ffmpegTransCode.push('-c:a', 'mp3', '-b:a', '32k', '-y', path.normalize(data.output + "/" + path.basename(data.audio).split('.')[0] + "-32k.mp3"))
            }
            let frate
            let duration
        try {
            for (var i = 0; probeResults.streams.length > i; i++) {
                console.log("looking for video")
                console.log(probeResults.streams[i])
                if (probeResults.streams[i].codec_type == 'video') {
                    console.log(probeResults.streams[i])
                 frate = probeResults.streams[i].r_frame_rate
                 duration = probeResults.streams[i].duration
                }
                
            }
        } catch {
            console.log("another vid")
        }
        
            // console.log(frate)
            //     if (data.audio != "None" ) {
            //         if (data.vid1.includes('.mp4') && data.audio.includes('.wav')) {
            //         ffmpegTransCode.push('-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-map', '0:v', '-map', '1:a', '-y', path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "_muxed." + path.basename(data.vid1).split('.')[1]))
            //     } else {
            //         ffmpegTransCode.push('-c', 'copy', '-map', '0:v', '-map', '1:a', '-y', path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "_muxed." + path.basename(data.vid1).split('.')[1]))
            //     }
            // }
            //     if (data.vid1 == "None" && data.audio != "None" ) {

            //         ffmpegTransCode.push('-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-map', '0:v', '-map', '1:a', '-y', path.normalize(data.output + "/" + path.basename(data.audio).split('.')[0] + "_muxed." + path.basename(data.audio).split('.')[1]))
            // }
            // console.log(ffmpegTransCode)
            if (data.highQuality == true) {
                console.log(ffmpegTransCode2)
            }
            // console.log(ffmpegPath)
            // setTimeout(function(){
// if (ffmpegTrans){
    ffTransFunc(ffmpegPath,ffmpegTransCode,video,vidNum)
// } else {
// ffmpegTrans.on('close', () => {
//     ffTransFunc(ffmpegPath,ffmpegTransCode,video)
// })

// }


            // },2000)
            function ffTransFunc(ffmpegPath,ffmpegTransCode,video,vidNum){
            let ffmpegTrans = spawn(ffmpegPath, ffmpegTransCode)
            let ffmpegTrans2
            let ffmpegTrans2PID = null
            ipcMain.on("killTrans", function () {
                // console.log(ffmpegTrans2PID)
                if (ffmpegTrans) {
                    ffmpegTrans.kill();
                }
                if (ffmpegTrans2PID != null) {
                    killAll(ffmpegTrans2PID)
                }
            })
            // console.log(ffmpegTrans)
            ffmpegTrans.on('exit', (statusCode) => {
                // console.log(statusCode)
                if (vidNum < videos.length) {
                    vidNum++
                    ffmpegBuildCode(data,vidNum)
                } else {
                if (data.highQuality == true) {
                    console.log("2nd pass")
                    ffmpegTrans2 = spawn(ffmpegPath, ffmpegTransCode2)
                    ffmpegTrans2PID = ffmpegTrans2.pid
                    killsignal = true
                    ffmpegTrans2.on('exit', (statusCode) => {
                        if (statusCode === 0) {
                            mainWindow.webContents.send('trans-status', 'Done')
                            mainWindow.webContents.send('trans-progress', '100%')
                            // mainWindow.webContents.send('trans-done', path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "_muxed." + path.basename(data.vid1).split('.')[1]) + "<br>" + path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "_1080p.mp4") + "<br>" + path.normalize(data.output + "/"+ path.basename(data.vid1).split('.')[0] + "_720p.mp4") + "<br>" + path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "_360p.mp4"))
                            if (i === videos.length) {
                            mainWindow.webContents.send('trans-done', "The files have transcoded. If you have multiple files, some may still be processing.")
                            }
                            rimraf(tmpFolder, function () {});
                        }
                        if (statusCode === 255) {
                            mainWindow.webContents.send('trans-status', 'Cancelled')
                            mainWindow.webContents.send('trans-sub', '<small>You gave up, not me.</small>')
                            rimraf(tmpFolder, function () {});
                        }
                    })
                    ffmpegTrans2.stderr.on('data', (err) => {
                        console.log(err.toString())
                        if (err.includes('time=')) {
                            mainWindow.webContents.send('trans-progress', Math.floor(Math.floor(Number(new String(err).split('time=')[1].split(' ')[0].split(":")[0] * 60 * 60) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1]) * 60 + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[2]) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1] * (1 / parseInt(frate)))) / duration * 100) + "%")
                            // mainWindow.webContents.send('cat-progress', new String(err).split('time=')[1].split(' ')[0])
                            // console.log()
                            // } else {
                            var randomNumber = Math.floor(Math.random() * progressQuotes.length)
                            // console.log(progressQuotes[randomNumber])
                            // console.log(err)
                            mainWindow.webContents.send('trans-status', 'Transcoding Pass 2 of 2')
                            mainWindow.webContents.send('trans-sub', '<small>' + progressQuotes[randomNumber] + '</small>')

                        }
                    })
                    // });
                } else {
                    if (statusCode === 0) {
                        mainWindow.webContents.send('trans-status', 'Done')
                        mainWindow.webContents.send('trans-progress', '100%')
                        // mainWindow.webContents.send('trans-done', path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "_muxed." + path.basename(data.vid1).split('.')[1]) + "<br>" + path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "_1080p.mp4") + "<br>" + path.normalize(data.output + "/"+ path.basename(data.vid1).split('.')[0] + "_720p.mp4") + "<br>" + path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "_360p.mp4"))
                        mainWindow.webContents.send('trans-done', "The files have transcoded. If you have multiple files, some may still be processing.")
                        try {
                            fs.unlink(data.output + '/1080.log')
                            fs.unlink(data.output + '/720.log')
                            fs.unlink(data.output + '/360.log')
                        } catch {
                            console.log("oops")
                        }
                        // rimraf(tmpFolder, function () {});
                    }
                }
                if (statusCode === 255) {
                    mainWindow.webContents.send('trans-status', 'Cancelled')
                    mainWindow.webContents.send('trans-sub', '<small>You gave up, not me.</small>')
                    try {
                        fs.unlink(data.output + '/1080.log')
                        fs.unlink(data.output + '/720.log')
                        fs.unlink(data.output + '/360.log')
                    } catch {
                        console.log("oops")
                    }
                    // rimraf(tmpFolder, function () {});
                }
            }
            })
            ffmpegTrans.stderr.on('data', (err) => {
                console.log(err.toString())
                if (err.includes('time=')) {
                    // console.log(frate)
                    // if (videos.length > 0) {
                    //     mainWindow.webContents.send('trans-status', '<small>Transcoding ' + path.basename(video)+ '</small>')
                    //     mainWindow.webContents.send('trans-sub', '<small>Progress Bar will not work</small>')
                    // }
                    // else {
                    // console.log('progress: ' +  Math.floor(Math.floor(Number(new String(err).split('time=')[1].split(' ')[0].split(":")[0] * 60 * 60) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1]) * 60 + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[2]) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1] * (1 / parseInt(frate)))) / duration * 100) + "%")
                    mainWindow.webContents.send('trans-progress', Math.floor(Math.floor(Number(new String(err).split('time=')[1].split(' ')[0].split(":")[0] * 60 * 60) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1]) * 60 + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[2]) + Number(new String(err).split('time=')[1].split(' ')[0].split(":")[1] * (1 / parseInt(frate)))) / duration * 100) + "%")
                    
                    // mainWindow.webContents.send('cat-progress', new String(err).split('time=')[1].split(' ')[0])
                    // console.log()
                    // } else {
                    var randomNumber = Math.floor(Math.random() * progressQuotes.length)
                    // console.log(progressQuotes[randomNumber])
                    // console.log(err)
                    if (data.highQuality == true) {
                        mainWindow.webContents.send('trans-status', 'Transcoding Pass 1 of 2')
                    } else {
                        mainWindow.webContents.send('trans-status', 'Transcoding... ')
                    }
                    mainWindow.webContents.send('trans-sub', '<small>' + progressQuotes[randomNumber] + '</small>')
                // }
                }
            })
        }
        
    });
        } else {
            mainWindow.webContents.send('trans-status', 'Done')
            mainWindow.webContents.send('trans-progress', '100%')
            // mainWindow.webContents.send('trans-done', path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "_muxed." + path.basename(data.vid1).split('.')[1]) + "<br>" + path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "_1080p.mp4") + "<br>" + path.normalize(data.output + "/"+ path.basename(data.vid1).split('.')[0] + "_720p.mp4") + "<br>" + path.normalize(data.output + "/" + path.basename(data.vid1).split('.')[0] + "_360p.mp4"))
            mainWindow.webContents.send('trans-done', "The files have transcoded. If you have multiple files, some may still be processing.")
            // rimraf(tmpFolder, function () {});
            try {
                fs.unlink(data.output + '/1080.log')
                fs.unlink(data.output + '/720.log')
                fs.unlink(data.output + '/360.log')
            } catch {
                console.log("oops")
            }
         
        }
    }
        // })
//     })
// });

ipcMain.on('submitdstreamURLForm', function (event, data) {
    console.log("downloading stream")
    fs.mkdtemp(path.join(os.tmpdir(), 'foo-'), (err, tmpFolder) => {
        if (err) throw err;
        console.log(tmpFolder);
        console.log(data)
        if (data.vid1.includes('youtube.com')) {
            const video = youtubedl(data.vid1)
            // ['--get-filename'], 
            // { cwd: __dirname })

            video.on('info', function (info) {
                var progress = Progress({
                    time: 100,
                    length: info.size
                })
                console.log('Download started')
                console.log(info)
                console.log('filename: ' + info.fulltitle)
                let yttitle = info.fulltitle
                let ytext = info.ext
                console.log('size: ' + info.size)
                mainWindow.webContents.send('dstreamURL-status', 'Finding info for video: ' + info.fulltitle)
                mainWindow.webContents.send('dstreamURL-progress', '25%')
                mainWindow.webContents.send('dstreamURL-sub', '<small>The progress bar may not work.</small>')
                progress.on('progress', function (progress) {
                    console.log('download completed ' + progress.percentage + '%')
                    mainWindow.webContents.send('dstreamURL-progress', progress.percentage + '%')
                    if (progress.percentage == "100") {
                        mainWindow.webContents.send('dstreamURL-status', 'Done')
                        mainWindow.webContents.send('dstreamURL-progress', '100%')
                        mainWindow.webContents.send('dstreamURL-done', data.output + "/" + yttitle + '.' + ytext)
                    }
                });
                video.pipe(fs.createWriteStream(data.output + "/" + yttitle + '.' + ytext))
                let reader = fs.createReadStream(data.output + "/" + yttitle + '.' + ytext).pipe(progress)
            })

        } else {
            let ffprobe = spawn(ffprobePath, ['-hide_banner', '-i', data.vid1, '-show_format', '-show_streams', '-of', 'json'])
            mainWindow.webContents.send('dstreamURL-status', 'Finding info...  ')
            mainWindow.webContents.send('dstreamURL-sub', '<small>The progress bar may not work.</small>')

            function probeRun(cmd, callback) {
                var result = '';
                cmd.stdout.on('data', function (data) {
                    result += data.toString();
                });
                cmd.on('close', function (code) {
                    return callback(JSON.parse(result));
                });
            }

            function probeParse(result, callback) {
                // let probeResults = JSON.parse(result)
            }

            // if (data.vid1.includes(".ts")) {
            probeRun(ffprobe, function (probeResults) {
                // console.log(probeResults)
                function findFrameRate(probeResults, callback) {


                    for (var index in probeResults) {
                        for (var keys in probeResults[index]) {
                            for (var key in probeResults[index][keys]) {
                                // console.log(key+": "+probeResults[index][keys][key]);
                                if (probeResults[index][keys]['r_frame_rate'] && probeResults[index][keys]['r_frame_rate'] != '0/0') {
                                    return callback(probeResults[index][keys]['r_frame_rate'])
                                }
                            }
                        }
                    }

                }
                findFrameRate(probeResults, function (f_rate) {
                    var ffmpegdstreamURLCode = []
                    ffmpegdstreamURLCode.push('-i', data.vid1, '-c', 'copy', '-loglevel', 'debug', '-y', path.normalize(data.output + "/" + url.parse(data.vid1).pathname.split("/")[url.parse(data.vid1).pathname.split("/").length - 1].split(".")[0] + ".mp4"));
                    console.log(data.output + "/" + url.parse(data.vid1).pathname.split("/")[url.parse(data.vid1).pathname.split("/").length - 1].split(".")[0] + ".mp4")
                    let ffmpegdstreamURL = spawn(ffmpegPath, ffmpegdstreamURLCode)
                    ffmpegdstreamURL.on('exit', (statusCode) => {
                        // if (statusCode === 0) {
                        //     mainWindow.webContents.send('dstreamURL-status', 'done')
                        //     mainWindow.webContents.send('dstreamURL-progress', '100%')
                        //     rimraf(tmpFolder, function () {});
                        // }
                        if (statusCode === 0) {
                            mainWindow.webContents.send('dstreamURL-status', 'Done')
                            mainWindow.webContents.send('dstreamURL-progress', '100%')
                            mainWindow.webContents.send('dstreamURL-done', path.normalize(data.output + "/" + url.parse(data.vid1).pathname.split("/")[url.parse(data.vid1).pathname.split("/").length - 1].split(".")[0] + ".mp4"))
                            rimraf(tmpFolder, function () {});
                        }
                        if (statusCode === 255) {
                            mainWindow.webContents.send('dstreamURL-status', 'Cancelled')
                            mainWindow.webContents.send('dstreamURL-sub', '<small>You gave up, not me.</small>')
                            rimraf(tmpFolder, function () {});
                        }
                    })
                })


                ffmpegdstreamURL.stderr.on('data', (err) => {
                    // console.log(probeResults.streams[0].duration)
                    // var frate = JSON.parse(response);

                    if (err.toString().includes('time=')) {
                        mainWindow.webContents.send('dstreamURL-progress', Math.floor(Math.floor(Number(new String(err.toString()).split('time=')[1].split(' ')[0].split(":")[0] * 60 * 60) + Number(new String(err.toString()).split('time=')[1].split(' ')[0].split(":")[1]) * 60 + Number(new String(err.toString()).split('time=')[1].split(' ')[0].split(":")[2]) + Number(new String(err.toString()).split('time=')[1].split(' ')[0].split(":")[1] * (1 / parseInt(f_rate)))) / probeResults.format.duration * 100) + "%")
                    }
                    var randomNumber = Math.floor(Math.random() * progressQuotes.length)
                    // console.log(progressQuotes[randomNumber])

                    mainWindow.webContents.send('dstreamURL-status', 'Downloading...  ')
                    mainWindow.webContents.send('dstreamURL-sub', '<small>' + progressQuotes[randomNumber] + '</small>')

                    // }
                })
            });
        }
    });

})
// });

// });