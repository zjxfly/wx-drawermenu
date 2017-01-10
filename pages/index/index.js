//index.js
//获取应用实例
var app = getApp()
Page({
  drawerMenuMoveData: {
    check: false,   //是否触发滑动操作
    state:0,    //0:初始状态 1:菜单弹出中状态 2:菜单弹入状态中 3:菜单弹出状态
    firstTouchX:0,  //首次触摸X坐标值
    touchCheckX:60,  //触发滑动的触摸X
    moveX:0,   // 滑动操作横向的移动距离
    maxMoveX: (app.globalData.deviceInfo.windowWidth - 60), //抽屉菜单最大移动距离
    lastTranlateX: 0  //上次动画效果的平移距离，用于校准left值
  },
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl:'../../image/head.png', 
      nickName:'疯狂早茶的主页',
      nickName2:'疯狂早茶的抽屉菜单'},
    mainPageLeft: 0,
    drawerMenuLeft: -800,
    mainPagePosition: 'absolute',
    animationData: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
  },
  onMainPageTouchstart: function(e) {
    var data = this.drawerMenuMoveData;
    var clientX = e.touches[0].clientX;
    //初识状态
    if (data.state === 0) {
      if (clientX <= data.touchCheckX && clientX > 20) {
        data.check = true;
        data.state = 1;
        data.firstTouchX = clientX;
      }
    }
    //菜单弹出状态
    else if (data.state === 3) {
      if (clientX >= data.maxMoveX) {
        data.check = true;
        data.state = 2;
        data.firstTouchX = clientX;
      }
    } 
  },
  onMainPageTouchmove: function(e) {
    var data = this.drawerMenuMoveData;
    var pixelRatio = app.globalData.deviceInfo.pixelRatio;
    if (data.check) {
      var mainPageLeft = 0, drawerMenuLeft = 0;
      var moveX = e.touches[0].clientX - data.firstTouchX;
      if (data.state === 1)
      {
        //处理边界状态
        if (moveX < 0) {
          moveX = 0;
        }
        if (moveX > data.maxMoveX) {
          moveX = data.maxMoveX;
        }
        if (moveX >= 0 && moveX <= data.maxMoveX) {
          data.moveX = moveX;
          moveX = moveX - data.lastTranlateX;
          //px转为rpx
          moveX = moveX * pixelRatio;
          mainPageLeft = moveX;
          drawerMenuLeft = -800 + moveX;
        }
      }
      else if (data.state === 2) {
        //处理边界状态
        if (moveX > 0) {
          moveX = 0;
        }
        if (moveX < -data.maxMoveX) {
          moveX = -data.maxMoveX; 
        }
        if (moveX <= 0 && moveX >= -data.maxMoveX) {
          data.moveX = moveX;
          moveX = moveX - data.lastTranlateX;
          //px转为rpx
          moveX = moveX * pixelRatio;
          var maxMoveX = data.maxMoveX * pixelRatio;
          mainPageLeft = maxMoveX + moveX;
          drawerMenuLeft = maxMoveX -800 + moveX;
        }
      }
     
      this.setData({mainPageLeft: mainPageLeft, 
                    drawerMenuLeft: drawerMenuLeft});
    }
  },
  onMainPageTouchend: function(e) {
    var data = this.drawerMenuMoveData;
    if (!data.check) {
      return;
    }
    data.check = false;
    data.firstTouchX = 0;
    var moveX = data.moveX;
    data.moveX = 0;
    var animation = wx.createAnimation({duration: 100});
    var translateX = 0;
    var mainPageLeft = 0;
    var windowWidth = app.globalData.deviceInfo.windowWidth;
    if (data.state === 1)
    {
      if (moveX === 0 || moveX === data.maxMoveX) {
        data.state = (moveX === 0) ? 0 : 3;
        return;
      }
      mainPageLeft = moveX;
      //滑动距离是否超过窗口宽度一半
      if (mainPageLeft > (windowWidth / 2)) {
        translateX = data.maxMoveX - moveX;
        data.state = 3;
      }
      else {
        translateX = -moveX;
        data.state = 0;
      }
    } 
    else if (data.state === 2) {
      if (moveX === 0 || moveX === -data.maxMoveX) {
        data.state = (moveX === 0) ? 3 : 0;
        return;
      }
      //滑动距离是否超过窗口宽度一半
      mainPageLeft = data.maxMoveX + moveX
      if (mainPageLeft > (windowWidth / 2)) {
        translateX = -moveX;
        data.state = 3;
      }
      else {
        translateX = -mainPageLeft;
        data.state = 0;
      }
    }
    translateX += data.lastTranlateX;
    data.lastTranlateX = translateX;
    animation.translateX(translateX).step();
    this.setData({
      animationData:animation.export()
    });
  },

  onMainPageTap: function(e) {
    var data = this.drawerMenuMoveData;
    if (data.state !== 3) {
      return;
    }
    data.state = 0;
    var translateX = -data.maxMoveX;
    translateX += data.lastTranlateX;
    data.lastTranlateX = translateX;
    var animation = wx.createAnimation({duration: 100});
    animation.translateX(translateX).step();
    this.setData({
      animationData:animation.export()
    });
  }
})
