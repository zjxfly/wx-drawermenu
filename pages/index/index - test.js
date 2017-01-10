//index.js
//获取应用实例
var app = getApp()
Page({
  drawerMenuMoveData: {
    check: false,
    state:0,
    firstTouchX:0,
    touchCheckX:40,
    moveX:0,
    maxMoveX: (app.globalData.deviceInfo.windowWidth - 60),
    lastTranlateX: 0
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
  onMainPageTouchstart(e) {
    var data = this.drawerMenuMoveData;
    if (e.touches[0].clientX <= data.touchCheckX) {
      data.check = true;
      data.firstTouchX = e.touches[0].clientX;
    }
   
  },
  onMainPageTouchmove(e) {
    var data = this.drawerMenuMoveData;
    var pixelRatio = app.globalData.deviceInfo.pixelRatio;
    if (data.check) {
      var moveX = e.touches[0].clientX - data.firstTouchX;

      if (moveX < 0 && this.data.moveX != 0) {
        moveX = 0;
      }
      if (moveX > data.maxMoveX && data.moveX != data.maxMoveX) {
        moveX = data.maxMoveX;
      }
      console.log(moveX);
      if (moveX >= 0 && moveX <= data.maxMoveX) {
        data.moveX = moveX;
        //moveX = moveX - data.lastTranlateX;
        //moveX = moveX * pixelRatio;
        this.setData({mainPageLeft: moveX, 
                      drawerMenuLeft: moveX});
                      
      }  
    }
  },
  onMainPageTouchend(e) {
    var data = this.drawerMenuMoveData;
    if (!data.check) {
      return;
    }
    if (data.moveX === 0 || data.moveX === data.maxMoveX) {
      return;
    }
    var windowsWidth = app.globalData.deviceInfo.windowWidth;
    var animation = wx.createAnimation({duration: 100});
    var translateX = 0;
    console.log(data.moveX);
    if (data.moveX > (windowsWidth / 2)) {
      translateX = data.maxMoveX;
    }
    else {
      translateX = 0;
    }
    animation.translateX(translateX).step();

    this.setData({
      animationData:animation.export()
    });

    data.check = false;
    data.firstTouchX = 0;
    data.moveX = 0;
    console.log(e);
  },
})
