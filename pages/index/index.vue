<template>
	<view class="page">
		<!-- 轮播图开始-->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(carousel,index) in carouselList" :key="index">
				<view class="swiper-item">
					<image class="carousel" :src="carousel.image"></image>
				</view>
			</swiper-item>
		</swiper>
		<!-- 轮播图结束-->
		
		<!-- 热门电影开始 -->
		<view class="page-block hot-title-wrapper">
			<view class="title-flex">
				<image src="../../static/icos/hot.png" class="hot-icon"></image>
				<view class="hot-title">热门电影</view>
			</view>
		</view>
		
		<scroll-view scroll-x="true" class="page-block hot">
			<view v-for="hot in hotList" class="single-poster">
				<view class="poster-wrapper">
					<image class="poster-icon" :src="hot.image"></image>
					<view class="poster-title">{{hot.title}}</view>
					<rating :score="hot.score" :show="1"></rating>
				</view> 
			</view>			
		</scroll-view>
		<!-- 热门电影结束-->
		
		<!-- 热门预告开始 -->
		<view class="page-block hot-title-wrapper">
			<view class="title-flex">
				<image src="../../static/icos/interest.png" class="hot-icon"></image>
				<view class="hot-title">热门预告</view>
			</view>
		</view>
		
		<view class="page-block notice-wrapper">
			<video class="notice-single" v-for="notice in noticeList"
			       :src="notice.vedio"
				   :poster="notice.cover"
				   controls="true"
			></video>
		</view>
		
		<!-- 热门预告结束 -->
		
		<!-- 猜你喜欢 开始-->
		<view class="page-block hot-title-wrapper">
			<view class="title-flex">
				<image src="../../static/icos/guess-u-like.png" class="hot-icon"></image>
				<view class="hot-title">猜你喜欢</view>
			</view>
		</view>
		
		<view class="page-block ulike-wrapper">
			<view v-for="(ulike,gIndex) in likeList" :key="gIndex" class="ulike-single">
				<image :src="ulike.image" class="ulike-pic"></image>
			
			    <view class="ulike-desc">
					<view class="ulike-title">{{ulike.title}}</view>
				    <rating :score="ulike.score" :show="0"></rating>
					<view class="ulike-info">导演:{{ulike.director}}</view>
					<view class="ulike-info">主演:{{ulike.actor}}</view>
				</view>
				
				<view class="ulike-praise" :data-gIndex="gIndex" @click="praiseMe">
					<image src="../../static/icos/praise.png" class="praise-ico"></image>
					<view class="praise-title">点赞</view>
					<view :animation="animationArr[gIndex]" class="praise-title addOne">+1</view>	
				</view>
			</view>
			
			
		</view>
		<!-- 猜你喜欢 结束-->
	</view>
</template>

<script>
	import common from '../../common/common.js';
	import rating from '../../components/rating.vue';
	
	export default {
		data() {
			return {
				carouselList:[] ,//保存轮播图数据
				hotList:[] ,//热门电影的数据
				noticeList:[] ,//热门预告片的数据	
				likeList:[] ,//你喜欢的电影数据	
				
				animationData:{} ,//动画数据
				animationArr:[{},{},{},{},{}] //动画数据的数组
			}
		},
		onUnload(){
			//退出页面时，清空动画数据
			this.animationData={};
			this.animationArr = [{},{},{},{},{}];
		},
		onLoad() {			
			
			//1 创建动画对象
			this.animation = uni.createAnimation();
			
            //加载页面完成时，发出ajax请求获取轮播图的信息
			uni.request({
			    url: common.serverUrl + '/carousel/list',			   
			    success: (res) => {					
			        if(res.data.errno==0){
						this.carouselList = res.data.data;
						
						for(var i=0;i<this.carouselList.length;i++){
							this.carouselList[i].image = common.serverUrl+this.carouselList[i].image;
						}
					}
			    }
			});
			
			//加载页面完成时，发出ajax请求获取 热门电影 的信息
			// 接口设计 ：/hot/list/:cnt
			//    输入参数cnt:代表查询回来几条数据
			//    返回结果：json
			uni.request({
			    url: common.serverUrl + '/hot/list/'+common.hotCount,			   
			    success: (res) => {					
			        if(res.data.errno==0){
						this.hotList = res.data.data;
						
						for(var i=0;i<this.hotList.length;i++){
							this.hotList[i].image = common.serverUrl+this.hotList[i].image;
						}
					}
			    }
			});
			
			//加载页面完成时，发出ajax请求获取 热门预告片 的信息
			// 接口设计 ：/notice/list
			uni.request({
			    url: common.serverUrl + '/notice/list',			   
			    success: (res) => {					
			        if(res.data.errno==0){
						this.noticeList = res.data.data;
						
						for(var i=0;i<this.noticeList.length;i++){
							this.noticeList[i].cover = common.serverUrl+this.noticeList[i].cover;
							this.noticeList[i].vedio = common.serverUrl+this.noticeList[i].vedio;
						}
					}
			    }
			});
			
			this.refresh();
		},
		onPullDownRefresh(){
			//处理下拉刷新
			this.refresh();
		},
		methods: {	
			praiseMe(e){
				var gIndex = e.currentTarget.dataset.gindex;
				
				//2 调用动画对象的方法设置动画
				this.animation.translateY(-60).opacity(1).step({duration:400});
				
				//3 从动画对象export出数据
				this.animationData = this.animation;
				this.animationArr[gIndex] = this.animationData.export();
				
				//4 要想连续操作,上边的动画效果还原
				setTimeout(()=>{
					this.animation.translateY(0).opacity(0).step({duration:0});
					this.animationData = this.animation;
					this.animationArr[gIndex] = this.animationData.export();
				},500);
			},
			refresh(){
				//loading提示框：显示处理进度
				uni.showLoading({
					title:'加载中...',
					mask:true //透明蒙层
				});
				//加载页面完成时，发出ajax请求获取 猜你喜欢 的信息
				// 接口设计 ：/ulike/list
				uni.request({
				    url: common.serverUrl + '/ulike/list',			   
				    success: (res) => {					
				        if(res.data.errno==0){
							this.likeList = res.data.data;
							
							for(var i=0;i<this.likeList.length;i++){
								this.likeList[i].image = common.serverUrl+this.likeList[i].image;
							}
						}						
				    },
					complete:(res)=>{
						//远程数据加载完毕，关闭loading提示框
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}
				});
			}
		},
		components:{
			rating
		}
	}
</script>

<style>
	.page .carousel{
		width:100%;
		height:440upx;
	}
	/* 热门电影的样式 开始 */
	.hot-title-wrapper{
		margin-top:10upx;
		padding:20upx;
	}
	.title-flex{
		display:flex;
		flex-direction: row;
	}
	.hot-icon{
		width:30upx;
		height:30upx;
	}
	.hot-title{
		font-size: 20upx;
		font-weight:bold;
		margin-left:10upx;
	}
	.hot{
		width:100%;
		white-space: nowrap;
	}
	.single-poster{
		margin-left:10upx;
		display:inline-block;
	}
	.poster-wrapper{
		display:flex;
		flex-direction: column;
	}
	.poster-icon{
		width:200upx;
		height:270upx;
	}
	.poster-title{
		width:200upx;
		font-size:20upx;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	/* 热门电影的样式 结束 */
	
	/*热门预告样式开始*/
	.notice-wrapper{
		display:flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding:0upx 20upx 20upx 20upx;
		justify-content: space-between;
	}
	.notice-single{
		width:350upx;
		height:220upx;
		margin-bottom:10upx;		
	}
	/*热门预告样式结束*/
	
	/*猜你喜欢 样式开始*/
	.ulike-wrapper{
		width:100%;
		display:flex;
		flex-direction: column;
		padding:0upx 20upx 20upx 20upx;
	}
	.ulike-single{
		display:flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 20upx;
	}
	.ulike-pic{
		width:180upx;
		height:190upx;
		border-radius: 3%;
	}
	.ulike-desc{
		width:360upx;
		display:flex;
		flex-direction: column;
	}
	.ulike-title{
		font-size:24upx;
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.ulike-info{
		font-size:16upx;
		color:#808080;
	}
	.ulike-praise{
		width:180upx;
		display: flex;
        flex-direction: column;
		border-left:2px dashed #C0C0C0;
		justify-content: center;
	}
	.praise-ico{
		width:40upx;
		height:40upx;
		align-self: center;
	}
	.praise-title{
		font-size:24upx;
		align-self: center;
		color:#FFC033;
	}
	.addOne{
		font-weight:bold;
		opacity: 0;
	}
	/*猜你喜欢 样式结束*/
</style>
