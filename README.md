# cat-app-http

# Table of Contents


1. [What is cat-app-http](#what-is-cat-app-http-)
2. [Project setup ](#project-setup-)
3. [Running docker ](#running-docker-)
   * [Verify docker Image](#verify-docker-image-) 
4. [Running docker Image](#running-docker-image-)
5. [Testing (is it working)](#testing-is-it-working-)
6. [STOPPING docker (running container)](#stopping-docker-docker-container-)
7. [Push docker image to repository](#push-docker-image-to-repository)
8. [Deploy to Kubernetes](#deploy-to-kubernetes)
7. [MIT LICENSE](#license-)


## What is cat-app-http

It is a working project (non Prod ready)
For getting started with a RESTFUL API server locally using [docker](https://docs.docker.com/)
The API is expose a list of cats with their characteristics

- It runs a server (docker) using `nodejs` [v16] 
- Exposes following  RESTFUL endpoints ( no database required) with all **CRUD** operations

|**Rest API** call          | **CRUD** operation | REST endpoints|
|:----:                 |:----:           |:----:|
|**GET**                | **R**ead        | `http://0.0.0.0:8080/` <br /> `http://0.0.0.0:8080/health`  <br /> `http://0.0.0.0:8080/api/cats`  <br /> `http://0.0.0.0:8080/api/cats/{id}`|
|**PATCH/PUT**          | **U**pdate)     | `http://0.0.0.0:8080/api/cats/{id}`|
|**POST** {with body}   | **C**reate      | `http://0.0.0.0:8080/api/cats`|
|**DELETE**             | **D**elete      | `http://0.0.0.0:8080/api/cats/{id}` |

 
 - You may get 3 types of **response**
 
  |Response `Code`  | Response `Status` |
  |:---------------:|:-----------------:|
  |     **200**     |       `OK`        |
  |     **201**     |     `Created`     |
  |     **404**     |    `Not Found`    |
  

## Project setup

Clone the repository on your machine

|**Using** | **Comand** |
|:---:|:---:|
|via **https**|```git clone https://github.com/melnottp/cat-app-http.git``` |
|via **ssh**|```git clone git@github.com:melnottp/cat-app-http.git``` |

```shell
cd cat-app-http
```

Prequisite / Assumption
- You have`docker` installed and running on your machine.

If not, its highly recomended to [Get docker](https://docs.docker.com/get-docker/)


## Running docker 

```
docker build . -t cat-app-http
```

> To know why we used `-t Allocate a pseudo-TTY` read this [stackoverflow thread](https://stackoverflow.com/a/40026942)

### Verify docker Image

After `docker build` is completed, verify if a docker image is created and listed

run `docker images`

```shell
docker images
REPOSITORY                      TAG         IMAGE ID      CREATED         SIZE
localhost/cat-app-http  latest      8f74146744df  18 minutes ago  928 MB
```
 > You may have more than one row in result, but make sure you have the one with  **REPOSITORY** `localhost/cat-app-http`

also see you got a random (uniqie) **IMAGE ID** assigned to the image you just created, in my case it was `8f74146744df`

## Running docker Image

Now that you have a **IMAGE ID**, lets run that image


```shell
docker run -p 8080:8080 8f74146744df
```

`docker run -p <your-port-external>:<docker-internal-port-exposed-for-access> IMAGE_ID`

For more details on `-p`  read [**Publish or expose port (-p, --expose)**🔗](https://docs.docker.com/engine/reference/commandline/run/#publish-or-expose-port--p---expose) 

 open a new tab on terminal and verify this docker (running)

```shell
docker ps
```

## Testing

Lets hit the docker image as a **client** / **User** 

|Test Type (Positive /Negative) |**CLIENT** On terminal | Response | **SERVER** (if Docker running with logs) | 
|:----:|:---:|:---:|:---:|
|`Home Page` |`curl 0.0.0.0:8080`| *Welcome, this is your Home page* | `CalledGET : /`|
|`Invalid endpoint`|`http://0.0.0.0:8080/dascbajb` |`{"message":"Route not found"}`|`CalledGET : /dascbajb`  <br /> This endpoint is not implemented / unavailable at the moment !!|
|`health check` | `http://0.0.0.0:8080/health` |`{"uptime":29.560686169,` <br /> `"message":"OK","timestamp":1644057630652}`|`CalledGET : /health`|



## STOPPING docker (docker container)

firts lets find the  runing one
`docker ps`

```shell
CONTAINER ID  IMAGE                                  COMMAND      CREATED            STATUS                 PORTS                   NAMES
a5a149a53466  localhost/cat-app-http:latest  node app.js  About an hour ago  Up About a minute ago  0.0.0.0:8080->8080/tcp  ecstatic_cray
```

see the status column : **STATUS**
```
Up About a minute ago
```

Stop using 
1.**CONTAINER ID** 
    ```shell
    docker stop a5a149a5346
    ```
    
2.**NAMES** 
    ```shell
    docker stop ecstatic_cray
    ```

> In case you want to confirm ---->> run `docker ps` it should show no running image 

```shell
docker ps
CONTAINER ID  IMAGE       COMMAND     CREATED     STATUS      PORTS       NAMES
```

## Push docker image to repository
Generic command to push image to docker repository 
```shell
docker tag local-image:tagname new-repo:tagname
docker push new-repo:tagname
```

```shell
sudo docker tag cat-app-http:latest tellmenop/cat-app-http:latest
sudo docker push tellmenop/cat-app-http:latest
```

## Deploy to Kubernetes
Prequisite / Assumption
- You have`Kubernetes Cluster` installed and running.
- Kubectl configured on your machine to access your Kubernetes Cluster

To deploy the application
```shell
kubectl create deployment cat-app --image=tellmenop/cat-app-http:latest
```
Expose the application with a service (ELB, NodePort)
kubectl create service nodeport cat-app-svc --tcp=31080:8080

## License

**cat-app-http** was released under [MIT License](LICENSE)



