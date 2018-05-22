var http = require('http');
var fs = require('fs');
var request = require('request');
var unzip = require('unzip2');
var Driver = function () {
this.timer = '';
this.timer2 = '';
};
Driver.prototype = {
  /* 读取本地版本 */
  readFile: function () {
    var self = this;
    if (fs.existsSync('src/js/global.js')) {
      self.case1();
    } else {
      $.ajax({
        type: 'post',
        url: 'url(接口地址)',
        dataType: 'jsonp',
        contentType: "application/jsonp; charset=utf-8",
        data: {
          'userId': 0,
        },
        success: function (data) {
          console.log("正在下载解压包...");
          if (data.code == 0) {
            if (data.result.update == 1) {
              var gx = document.getElementsByClassName('gx')[0];
              gx.style.display = "block";
              /* 下载地址 下载到的目录*/
              if (fs.existsSync('nsrc') || fs.existsSync('upload/zip')) {
                self.rmdirFile('upload/zip', function () {

                  self.rmdirFile('nsrc', function () {

                    self.createDir('upload/zip', function () {
                      console.log("创建下载zip目录成功...");
                      //创建下载zip的目录
                      self.downFile(data.result.url);
                    });
                  })
                })
              } else {
                self.createDir('upload/zip', function () {
                  console.log("创建下载zip目录成功...");
                  //创建下载zip的目录
                  self.downFile(data.result.url);
                });
              }
            } else {
              setTimeout(function () {
                window.location.href = "../src/Login/login.html";
              }, 2250);
            }
          }
        },
        error: function () {
          alert(data.msg);
        }

      });

    }
  },
  /* 如果global没有被删除*/
  case1: function () {
    var self = this;
    global.post('/system/checkVersion', {}, function (data) {
      console.log("正在下载解压包...");
      if (data.code == 0) {
        if (data.result.update == 1) {
          var gx = document.getElementsByClassName('gx')[0];
          gx.style.display = "block";
          /* 下载地址 下载到的目录*/
          if (fs.existsSync('nsrc') || fs.existsSync('upload/zip')) {
            self.rmdirFile('upload/zip', function () {

              self.rmdirFile('nsrc', function () {

                self.createDir('upload/zip', function () {
                  console.log("创建下载zip目录成功...");
                  //创建下载zip的目录
                  self.downFile(data.result.url);
                });
              })
            })
          } else {
            self.createDir('upload/zip', function () {
              console.log("创建下载zip目录成功...");
              //创建下载zip的目录
              self.downFile(data.result.url);
            });
          }
        } else {
          setTimeout(function () {
            window.location.href = "../src/Login/login.html";
          }, 2250);
        }
      } else {
        alert(data.msg);
      }
    });
  },
  /* 下载解压包 */
  downFile: function (url) {
    var self = this;
    self.download(url, 'upload/zip/nsrc.zip', function () {
      /* 下载完成创建解压目录 */
      clearInterval(self.timer);
      sc.style.width = 0;
      sj.innerHTML = '正在解压安装 2/2 '
      console.log('正在创建临时目录');
      self.createDir('nsrc', function () {
        self.unZip();
        console.log('正在解压...');
        /* 前端做的假进程 */
        setTimeout(function () {
          var startC = parseInt(Math.floor(Math.random() * 3 + 1) * 10);
          sc.style.width = startC + '%';
          self.timer2 = setInterval(function () {
            startC += startC + Math.floor(Math.random() * 3 + 1) * 0.2;
            console.log('aaa');
            if (startC >= 90) {
              clearInterval(self.timer2);
              startC = 90;
            }
            sc.style.width = startC + '%';
          }, 500);
        }, 1000);


      });
      /*self.unZip();*/
    });
  },
  /* 下载完成创建交换目录 */
  createDir: function (v, callback) {
    var slef = this;
    /* 创建的新目录名是nsrc*/
    fs.mkdir(v, function (err) {
      if (!err) {
        console.log('创建目录成功...');
        callback && callback(err);
      } else {
        console.log("创建目录失败...");
      }
    })
  },
  /* 解压zip */
  unZip: function () {
    var self = this;
    /* 解压到nsrc中*/
    var extract = unzip.Extract({
      path: 'nsrc' //process.cwd()
    }); //获取根目录
    fs.createReadStream('upload/zip/nsrc.zip').pipe(extract);
    extract.on('error', function (err) {
      console.log(err);

      console.log("解压失败");
    });
    extract.on('finish', function () {
      /* argv[1] 主模板的绝对路径 第一个命令行从 argv[2]这个位置开始 */
      /* 在此之前删除之前的src文件夹 */
      /* self.rmdirFile(process.cwd()+'\\'+'src', function () {
          console.log(1);
          /* 重命名文件夹 */
      /*self.reName(fs.readdirSync(process.cwd()+'\\'+'nsrc')[0]);*/

      /*console.log('success')
      });*/

    });

    extract.on('close', function () {
      /* */
      console.log("解压成功");
      self.rmdirFile('src', function () {
        /*删除掉之前的src文件夹 解压 重命名新的文件夹*/
        self.copy();
      })


    });
    extract.on('end', function () {});
  },
  copy: function () {
    var self = this;
    fs.rename('nsrc/src', 'src', function (err) {
      /* 删除 nsrc 如果能删除  说明压缩的 还未压缩完 再次压缩*/
      if (fs.existsSync('nsrc')) {
        fs.rmdir('nsrc', function (err) {
          if (err) {
            console.log(err);
            console.log("删除失败....");
          } else {
            console.log("删除成功...");
            self.copy();
          }
        });
      } else {
        self.rmdirFile('upload/zip', function () {
          console.log("删除缓存成功...");
          console.log("更新完成启动客户端...");
          sc.style.width = 100 + '%';
          setTimeout(function () {
            window.location.href = "../src/Login/login.html";
          }, 2250);
        });
      }

    })
  },
  /* 重命名 */
  reName: function (filename) {
    var self = this;
    /*  在此之前删除之前的src文件夹 */
    fs.rename('nsrc', 'src', function (err) {
      if (err) {
        console.log("重命名失败...");
      } else {
        console.log("重命名成功...");
        self.rmdirFile('upload/zip', function () {
          console.log("删除缓存成功...");
          console.log("更新完成启动客户端...");
        });
      }
    });
  },
  /* 删除文件夹 */
  rmdirFile: function (paths, callback) {
    var self = this;
    var files = [];
    /* 判断目录存在 */
    /* d递归遍历*/
    if (fs.existsSync(paths)) {
      files = fs.readdirSync(paths); //同步请求
      files.forEach(function (files, index) {
        var curPath = paths + "/" + files; //遍历出每个一个目录
        //如果当前目录也是目录
        if (fs.statSync(curPath).isDirectory()) { //recurse
          /* 递归遍历 */
          self.rmdirFile(curPath);
        } else {
          fs.unlinkSync(curPath); //删除文件
        }
      });
      fs.rmdirSync(paths); //删除空文件夹
      console.log("删除成功...");
    }
    callback && callback();

  },
  /*---- 下载解压包 ----*/
  download: function (uri, filename, callback) {
    var self = this;
    request.head(uri, function (err, res, body) {
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
      self.timer = setInterval(function () {
        sc.style.width = (fs.statSync(filename).size / res.headers['content-length']) * 100 + '%';
      }, 500);
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  },
},
console.log("执行结束");
