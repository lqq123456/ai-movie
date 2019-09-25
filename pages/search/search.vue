<template>
	<view class="page">
		<!--搜索关键字-->
		<view class="search-block">
			<image src="../../static/icos/search.png" class="search-ico"></image>
			<input v-model="keywords" placeholder="找预告" maxlength="20" confirm-type="done" @keypress:enter="find" class="search-input">
		</view>
		<!-- 搜索结果显示区-->
		<view class="search-result page-block">
			<view class="search-single">
				<image src="../../static/carousel/15.jpg" class="search-movie"></image> 
			</view>			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				movieList:[],
				keywords:'',
				page:1
			}
		},
		onLoad(){
			//加载时,没有搜索关键字,搜索price值最大的一页（9）数据
			//接口设计：   /search/list
			//  分页查询参数：page:页码,pageSize:每页条数,keyword:搜索关键字
			//   如果没有参数，就是刚进入时的查询(price最大的前9条)
			//   返回的json数据格式： {page:页码,total:总页数,count:总记录数,rows:[本页数据]}     
		},
		onReachBottom(){
			// keywords
			// page:  page+1
			// ajax
			// movieList = movieList + ajax
		}
		methods: {
			find(){
				var page=1;
				var pageSize=9;
				
				this.page=page;
			}
		}
	}
</script>

<style>
/* 搜索关键字开始*/
.search-block{
	width:100%;
	display:flex;
	flex-direction: row;
	justify-content: center;
	background-color:#F8F8F8;
	padding-left:20upx;
	
	position:fixed;
	top:100upx;
	z-index: 200;
}
.search-ico{
	width:65upx;
	height:65upx;
	background-color:#e0e0e0;
}
.search-input{
	flex:1;
	width:650upx;
	height:60upx;
	background-color:#e0e0e0;
	padding:0upx 10upx 6upx 10upx;
}
.search-result{
	display:flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content:space-between;
	margin-top:10upx;
	
	padding:100upx 20upx 20upx 20upx;
}
.search-single{
	
	margin-bottom:10upx;
}
.search-movie{
	width:200upx;
	height:270upx;
}
/* 搜索关键字结束*/
</style>
