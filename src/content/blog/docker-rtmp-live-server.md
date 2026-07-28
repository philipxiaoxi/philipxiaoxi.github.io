---
title: '进入 Docker 的魔法世界：最简单的直播服务器配置'
description: '在香橙派上安装 Docker，用 nginx-rtmp 镜像搭建 RTMP 直播服务，并说明如何修改、提交与导出镜像。'
pubDate: 'Jun 12 2021'
updatedDate: 'Jul 10 2021'
---

## 前言
前几天受老师影响，打算去瞧瞧这个docker到底怎么样，我心想虚拟机性能应该不咋地，但是百度上说很强。于是我破天荒的在香橙派安装了docker，从而开启了我的docker的魔法世界。这个香橙派就是图下的东东，没想到他也能运行docker！！！

![在这里插入图片描述](https://img-blog.csdnimg.cn/img_convert/60fc0df4747036279e0ba5953f6659f5.png#pic_center)

Docker 是一个开源的应用容器引擎，可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口，容器性能开销极低。这对树莓派非常有用，本教程将介绍 Docker 这个工具以及如何在 Raspbian 上安装 Docker。

## Docker 的应用场景
Web 应用的自动化打包和发布。
自动化测试和持续集成、发布。
在服务型环境中部署和调整数据库或其他的后台应用。
从头编译或者扩展现有的 OpenShift 或 Cloud Foundry 平台来搭建自己的 PaaS 环境。
## Docker 的优点
Docker 让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器上，便可以实现虚拟化。方便快捷已经是 Docker 的最大优势，过去需要用数天乃至数周的任务，在Docker容器的处理下，只需要数秒就能完成。Docker 可以简化部署多种应用实例工作。比如 Web 应用、后台应用、数据库应用、大数据应用比如 Hadoop 集群、消息队列等等都可以打包成一个镜像部署。
## 第一步安装Docker
安装方法百度上都有，我就不重复说了，但是树莓派、香橙派这些armV7处理器的建议脚本安装。部分文章说道，部分派性能太差或缺失指令集(?) 虽然能成功安装docker但是运行不起来，如树莓派zero。万幸的是我的香橙派完美运行。
## 安装方法(脚本安装)

```bash
sudo curl -sSL https://get.docker.com | sh
```
国内可以使用阿里云加速

```bash
sudo curl https://get.docker.com/ > ./docker_install.sh
sudo sh docker_install.sh –mirror Aliyun
```
## 常用的Docker命令

```bash
#查看 Docker 版本
docker -v
sudo docker pull 仓库/镜像:版本（留空的话默认为 latest）
sudo docker run 加参数，用来创建容器
#查看运行容器
sudo docker ps
#查看所有下载的镜像
sudo docker images
#进入容器终端
sudo docker exec -i -t ha /bin/bash
#实时查看10行的 ha 日志
sudo docker logs -f -t --tail 10 ha
#重启 systemctl 守护进程
sudo systemctl daemon-reload
#设置 Docker 开机启动
sudo systemctl enable docker
#开启 Docker 服务
sudo systemctl start docker
```

## 第一个docker镜像-nginx-rtmp
由于树莓派，香橙派这些是armv7处理器，大部分百度找到的nginx-rtmp镜像都是只支持x86 x64平台，所以我们需要去docker hub看看有没有自己能用的配好的镜像，不然得完全自己配置（悲）。
![支持的平台](https://img-blog.csdnimg.cn/20201225100128647.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzM1Mzg5Ng==,size_16,color_FFFFFF,t_70)
好在找到了 适合armv7 的  [vallahaye/nginx-rtmp](https://hub.docker.com/r/vallahaye/nginx-rtmp) 镜像。，可以看到支持arm平台。当然我们可以自己直接做镜像也是没问题的。然后把镜像下载到香橙派中。

```bash
docker pull vallahaye/nginx-rtmp
```
执行docker images 可以看到镜像已经下载到本机了。
![镜像](https://img-blog.csdnimg.cn/20201225100400665.png)
通过docker run 可以开启这个镜像，-p就是物理机的端口映射到容器里对应端口，--name就是启动的容器名字，可以自定义，-d就是后台运行的意思，后面就是运行的镜像名称。

```bash
docker run -p 1935:1935 -p 8080:80  --name rtmp -d vallahaye/nginx-rtmp
```
如果你运行成功了，执行docker ps 可以看到容器在跑，就已经搭好了 直播服务器啦！为什么呢？因为这个镜像是别人做好的直播服务器镜像。
![运行查询](https://img-blog.csdnimg.cn/20201225100736185.png)
镜像的使用方法这里就不再赘述，在镜像作者的github上已经有详细的readme.md文档介绍。[vallahaye/nginx-rtmp](https://github.com/vallahaye/docker-nginx-rtmp/tree/master)
## 修改他人的镜像
在使用这个镜像中，发现只能支持rtmp推流和播放，不支持hls，stat查询推流信息等功能。所以我们需要对镜像进行修改。那么我们怎么进入容器里面的shell呢。执行下面的命令可以进入到容器的bash。（部分镜像没有bash）

```bash
 docker exec -it 运行的容器id bash
```
进入后我们可以对容器的一些配置文件修改，修改后执行exit退出。如对nginx配置hls、stat功能。

```bash
load_module modules/ngx_rtmp_module.so;

user nginx;
worker_processes auto;

error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
  worker_connections 1024;
}

rtmp_auto_push on;
rtmp_auto_push_reconnect 1s;

rtmp {
  access_log /var/log/nginx/access.log;
  server {
    listen 1935;
    chunk_size 4096;
    listen [::]:1935 ipv6only=on;
    application push {
      live on;
      push rtmp://127.0.0.1:1935/live;
      push rtmp://127.0.0.1:1935/hls;
    }
    application live {
      live on;
      record off;
    }
    application hls {
      live on;
      hls on;
      hls_fragment 3s;
      hls_path /opt/data/hls;
    }
  }
}
http{
server
{
        listen 80 default_server;
        server_name _;
        index index.html index.htm index.php;
        root  /var/www/hlstest;
        location /hls {
            types {
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }
            alias /opt/data/hls;
            expires -1;
            add_header Cache-Control no-cache;
            add_header Access-Control-Allow-Origin *;
        }
        location /stat {
            rtmp_stat all;
            rtmp_stat_stylesheet stat.xsl;
        }
        location /stat.xsl {
            root /var/www/stat;
        }
}
}
```

## 提交修改后的容器
容器发生了变化，并不是保存了，需要commit才是保存到镜像。

```bash
docker commit -m="提交信息" -a="作者" 运行的容器id 要保存的容器名称
```
执行了上面的代码，我们执行 docker images 可以看到我们commit 好的镜像。
![镜像列表](https://img-blog.csdnimg.cn/20201225101816233.png)
## 运行自己的镜像
在运行自己的镜像之前，需要把先前的容器停止，移除，从而对应的监听端口释放。容器名称换成自己commit的。
```bash
docker run -p 1935:1935 -p 8080:80  --name rtmp -d xiaoxi-stat/nginx-rtmp
```

## 保存镜像到本地
为了方便，或者在其他服务器部署自己的镜像，可以保存自己的镜像。

```bash
docker save 镜像id > /opt/rtmp.tar(保存的位置)
```
以上就是docker的魔法世界。
