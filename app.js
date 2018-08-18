const express = require('express');
const bodyParser= require('body-parser');
const path = require('path');
var spawn = require("child_process").spawn;
var fs = require('fs');
var compile_run = require('compile-run');
const port= process.env.PORT||3000;

const app=express();
app.use(bodyParser.urlencoded({extended:false,limit:'50mb'}));
app.use(bodyParser.json({limit:'50mb'}));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.get("/",(req,res)=>{
res.render('index');
});

var runCppFile = function (filepath, fileName, stdin, callback) {
        console.log("In main function");
        // var proc = spawn('gcc', [filepath + '/' + fileName + ".c"]);
        var proc = spawn('gcc', [filepath + '/' + fileName + ".cpp", "-o", filepath + '/' + fileName, '-lstdc++']);
        var stdout = "";
        var stderr = "";
        var f = false;
        proc.stdout.on('data',function(data){
            console.log('stdout: '+data);   
        });
        proc.stderr.on('data', function (_stderr) {
            console.log(String(_stderr));
            stderr += _stderr;
        });
        console.log(stderr);
        proc.on('close', function (code) {
            if (code == 0) {
                console.log(code);
                // var proc1 = spawn('./a.exe',[]);
                var proc1 = spawn(filepath + '/' + fileName + '.exe',[]);
                var stdout1 = "";
                var stderr1 = "";
                var fl = false;
                var timeout1 = setTimeout(function () {
                    proc1.stdin.pause();
                    proc1.kill();
                    fl = true;
                }, 2000);
                if (stdin) {
                    proc1.stdin.write(stdin+"\n");
                    proc1.stdin.end();
                }
                proc1.stdout.on('data', function (_stdout) {
                    stdout1 += _stdout;
                });
                proc1.stdout.on('end', function () {
                    proc.kill();
                    fl = true;
                });
                proc1.stderr.on('data', function (_stderr) {
                    stderr1 += _stderr;
                });
                proc1.stderr.on('end', function () {
                    proc.kill();
                    fl = true;
                });
                proc1.on('close', function (code) {
                    if (code == 0) callback(stdout1, "");
                    else {
                        callback("", stderr);
                    }
                });
                if (fl) {
                    clearTimeout(timeout1);
                }
            }
            else {
                callback("", stderr);
            }
        });
        if (f) {
            clearTimeout(timeout);
        }
}

var runCFile = function (filepath, fileName, stdin, callback) {
    console.log("In main function");
    var proc = spawn('gcc', [filepath + '/' + fileName + ".c"]);
    // var proc = spawn('gcc', [filepath + '/' + fileName + ".cpp", "-o", filepath + '/' + fileName, '-lstdc++']);
    var stdout = "";
    var stderr = "";
    var f = false;
    proc.stdout.on('data',function(data){
        console.log('stdout: '+data);   
    });
    proc.stderr.on('data', function (_stderr) {
        console.log(String(_stderr));
        stderr += _stderr;
    });
    console.log(stderr);
    proc.on('close', function (code) {
        if (code == 0) {
            console.log(code);
            // var proc1 = spawn('./a.exe',[]);
            var proc1 = spawn(filepath + '/' + fileName + '.exe',[]);
            var stdout1 = "";
            var stderr1 = "";
            var fl = false;
            var timeout1 = setTimeout(function () {
                proc1.stdin.pause();
                proc1.kill();
                fl = true;
            }, 2000);
            if (stdin) {
                proc1.stdin.write(stdin+"\n");
                proc1.stdin.end();
            }
            proc1.stdout.on('data', function (_stdout) {
                stdout1 += _stdout;
            });
            proc1.stdout.on('end', function () {
                proc.kill();
                fl = true;
            });
            proc1.stderr.on('data', function (_stderr) {
                stderr1 += _stderr;
            });
            proc1.stderr.on('end', function () {
                proc.kill();
                fl = true;
            });
            proc1.on('close', function (code) {
                if (code == 0) callback(stdout1, "");
                else {
                    callback("", stderr);
                }
            });
            if (fl) {
                clearTimeout(timeout1);
            }
        }
        else {
            callback("", stderr);
        }
    });
    if (f) {
        clearTimeout(timeout);
    }
}


var runJavaFile = function (filepath, fileName, stdin, callback) {
    console.log("In main function");
    // var proc = spawn('gcc', [filepath + '/' + fileName + ".c"]);
    console.log(filepath);
    console.log(fileName);
    var proc = spawn('javac', [filepath + fileName + ".java"]);
    // var proc = spawn('gcc', [filepath + '/' + fileName + ".cpp", "-o", filepath + '/' + fileName, '-lstdc++']);
    var stdout = "";
    var stderr = "";
    var f = false;
    proc.stdout.on('data',function(data){
        console.log('stdout: '+data);   
    });
    proc.stderr.on('data', function (_stderr) {
        console.log(String(_stderr));
        stderr += _stderr;
    });
    console.log(stderr);
    proc.on('close', function (code) {
        if (code == 0) {
            console.log(code);
            // var proc1 = spawn('./a.exe',[]);
            var proc1 = spawn('java','-cp', filepath, "abs");
            // var proc1 = spawn('java',[filepath+"abs"]);
            // var proc1 = spawn(filepath + '/' + fileName + '.exe',[]);
            var stdout1 = "";
            var stderr1 = "";
            var fl = false;
            var timeout1 = setTimeout(function () {
                proc1.stdin.pause();
                proc1.kill();
                fl = true;
            }, 2000);
            if (stdin) {
                proc1.stdin.write(stdin+"\n");
                proc1.stdin.end();
            }
            proc1.stdout.on('data', function (_stdout) {
                stdout1 += _stdout;
            });
            proc1.stdout.on('end', function () {
                proc.kill();
                fl = true;
            });
            proc1.stderr.on('data', function (_stderr) {
                stderr1 += _stderr;
            });
            proc1.stderr.on('end', function () {
                proc.kill();
                fl = true;
            });
            proc1.on('close', function (code) {
                if (code == 0) callback(stdout1, "");
                else {
                    callback("", stderr);
                }
            });
            if (fl) {
                clearTimeout(timeout1);
            }
        }
        else {
            callback("", stderr);
        }
    });
    if (f) {
        clearTimeout(timeout);
    }
}

app.post('/',(req,res)=>{
var code = req.body.code;
var input = req.body.sampleinput;
console.log("Code");
console.log(code);
console.log("Input");
console.log(input);
var language=2;
if(language==1){
    var runC = function (code, stdin, callback) {
        if (!fs.existsSync('./code')) {
            fs.mkdirSync('./code', 0744);
        }
        if (!fs.existsSync('./code/c')) {
            fs.mkdirSync('./code/c', 0744);
        }
        var fileName = 'Source-' + Math.floor(Math.random() * 100000) + '-' + new Date().getTime();
        fs.writeFile('./code/c/' + fileName + '.c', code, function (err) {
            if (!err) {
                console.log("Error??Eh");
                runCFile('./code/c', fileName, stdin, function (stdout, stderr) {
                    callback(stdout, stderr, "");
                });
            }
            else {
                console.log(err);
                callback("", "", "Couldn't write the file!");
            }
        });
    }
    runC(code,input,(stdout,stderr,err)=>{
    console.log("In calling function");
    if(!err){
        console.log(stdout);
         console.log(stderr);
         }
         else{
         console.log(err);
         }
    });
}
else if(language==2){
var runCpp = function (code, stdin, callback) {
    if (!fs.existsSync('./code')) {
        fs.mkdirSync('./code', 0744);
    }
    if (!fs.existsSync('./code/cpp')) {
        fs.mkdirSync('./code/cpp', 0744);
    }
    var fileName = 'Source-' + Math.floor(Math.random() * 100000) + '-' + new Date().getTime();
    console.log(fileName);
    fs.writeFile('./code/cpp/' + fileName + '.cpp', code, function (err) {
        if (!err) {
            console.log("Error??Eh");
            runCppFile('./code/cpp', fileName, stdin, function (stdout, stderr) {
                callback(stdout, stderr, "");
            });
        }
        else {
            console.log(err);
            callback("", "", "Couldn't write the file!");
        }
    });
}
runCpp(code,input,(stdout,stderr,err)=>{
console.log("In calling function");
if(!err){
    console.log(stdout);
     console.log(stderr);
     }
     else{
     console.log(err);
     }
});
}
else if(language==3){
    var runJava = function (code, stdin, callback) {
        if (!fs.existsSync('./code')) {
            fs.mkdirSync('./code', 0744);
        }
        if (!fs.existsSync('./code/java')) {
            fs.mkdirSync('./code/java', 0744);
        }
        var dir = 'source-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000);
        fs.mkdir('./code/java/' + dir, 0744, function (err) {
            if (!err) {
                var fileName = 'Main';
                fs.writeFile('./code/java/' + dir + '/' + fileName + '.java', code, function (err) {
                    if (!err) {
                        runJavaFile('./code/java/' + dir + '/', fileName, stdin, function (stdout, stderr) {
                            callback(stdout, stderr, "");
                        });
                    }
                    else {
                        console.log(err);
                        callback("", "", "Couldn't write the file!");
                    }
                });
            }
            else {
                console.log(err);
            }
        });
    }
    runJava(code,input,(stdout,stderr,err)=>{
        console.log("In calling function");
        if(!err){
            console.log(stdout);
             console.log(stderr);
             }
             else{
             console.log(err);
             }
        });
}
});

app.listen(port,()=>{
    console.log("Server Started");
})