//http请求方法


//定义发送GET请求的方法
//传入一个字符串（请求行的url），一个接收响应体的回调函数
export function httpGet(url, callback) {
    //设置请求

    //1. 创建XMLHttpRequest对象（代理）
    let xhr = new XMLHttpRequest()
    //2. 设置请求行的方法、url   设置是否异步
    xhr.open("GET", url, true)
    //3. 设置请求体为null，发送请求
    xhr.send()



    //获取响应

    //4. 监听onreadystatechange事件（readystate的值改变的事件  0，1，2，3，4）
    //   若监听到readystate变化则执行回调函数
    xhr.onreadystatechange = () => {
        //若服务端返回响应完毕，且响应状态码为正常
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            //将json格式响应体转换为对象
            let responseObj = JSON.parse(xhr.response)
            //将响应体对象传入接收响应体的回调函数
            callback(responseObj)

        }
    }
}




//定义发送POST请求的方法
//传入一个字符串（请求行的url），一个对象（请求体数据），一个回调函数（接收响应体对象）
export function httpPost(url, bodyObj, callback) {
    //设置请求

    //1. 创建XMLHttpRequest对象（代理）
    let xhr = new XMLHttpRequest()
    //2. 设置请求行的方法、url   设置是否异步
    xhr.open("POST", url, true)
    //3 设置请求头的请求体类型
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8")
    //4. 将对象（请求体数据）转换为JSON格式
    let bodyJson = JSON.stringify(bodyObj)
    //5. 设置请求体为对象（请求体数据），发送请求
    xhr.send(bodyJson)



    //获取响应

    //6. 监听onreadystatechange事件（readystate的值改变的事件  0，1，2，3，4）
    //   若监听到readystate变化则执行回调函数
    xhr.onreadystatechange = () => {
        //若服务端返回响应完毕，且响应状态码为正常
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            //将json格式响应体转换为对象
            let responseObj = JSON.parse(xhr.response)
            //将响应体对象传入回调函数（接收响应体对象）
            callback(responseObj)
        }
    }
}
