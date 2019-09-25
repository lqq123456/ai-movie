<template>
	<view class="star-wrapper">
		<image class="star-ico" v-for="yellow in yellowStar" 
		       src="/static/icos/star-yellow.png"></image>
		<image class="star-ico" v-for="gray in grayStar"
			   src="/static/icos/star-gray.png"></image>
	    <view v-if="show==1" class="star-score">{{score}}</view>
	</view>
</template>

<script>
	//组件根据电影的评分，显示"星星"
	//有星星，显示黄色的，否则显示灰色的
	// 逻辑：分数有几个“1”
	export default {
		data() {
			return {
				yellowStar:0 ,//黄色星星的个数
				grayStar:5 //灰色星星的个数
			};
		},
		props:{
			score:0 ,//评分
			show:0 //是否显示分数，1显示,0不显示
		},
		created(){
			if(this.score!=null && this.score!=undefined && this.score!=""){
				this.yellowStar = parseInt(this.score);
				this.grayStar = 5-this.yellowStar;
			}
		}
	}
</script>

<style>
	.star-wrapper{
		display:flex;
		flex-direction: row;
	}
	.star-ico{
		width:30upx;
		height:30upx;
		margin-top:5upx;
	}
	.star-score{
		font-size:14px;
		margin-left:6upx;
		color:#999999;
	}
</style>
