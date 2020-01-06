<template>
  <div>
    <!--查询表单-->
    <el-form :model="params">
      <el-select v-model="params.siteId" placeholder="请选择站点">
        <el-option v-for="item in siteList" :key="item.siteId" :label="item.siteName" :value="item.siteId">
        </el-option>
      </el-select>
      <el-input v-model="params.pageAliase" placeholder="请输入别名" style="width: 150px;"></el-input>
      <el-button type="primary" v-on:click="query" size="small" plain>查询</el-button>
      <el-button type="info" v-on:click="resetData" size="small" plain>重置</el-button>
      <router-link class="mui-tab-item" :to="{path:'/cms/page/add/',query:{
           page: this.params.page,
           siteId: this.params.siteId,
           pageAliase: this.params.pageAliase
           }}">
        <el-button type="primary" size="small" plain>新增页面</el-button>
      </router-link>
    </el-form>
    <!--列表-->
    <el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="pageName" label="页面名称" width="120">
      </el-table-column>
      <el-table-column prop="pageAliase" label="别名" width="120">
      </el-table-column>
      <el-table-column prop="pageType" label="类型（静态、动态）" width="150">
      </el-table-column>
      <el-table-column prop="pageWebPath" label="访问路径" width="250">
      </el-table-column>
      <el-table-column prop="pagePhysicalPath" label="物理路径" width="250">
      </el-table-column>
      <el-table-column prop="pageCreateTime" label="创建时间" width="180" :formatter="formatCreatetime">
      </el-table-column>
      <el-table-column label="编辑" width="80">
        <template slot-scope="scope">

          <el-button size="small" type="primary" @click="edit(scope.row.pageId)">编辑
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="删除" width="80">
        <template slot-scope="scope">

          <el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="静态化" width="80">
        <template slot-scope="scope">
          <el-button size="small" type="primary" plain @click="generateHtml(scope.row.pageId)">静态化
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="发布" width="80">
        <template slot-scope="scope">
          <el-button size="small" type="primary" plain @click="postPage(scope.row.pageId)">发布
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <el-pagination background layout="prev, pager, next" @current-change="changePage" :page-size="this.params.size"
        :total="total" :current-page="this.params.page" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
  import * as cmsApi from '../api/cms'
  import utilApi from '@/common/utils';
  export default {
    data() {
      return {
        params: {
          page: 1, //页码
          size: 5, //每页显示个数
          siteId: '', //站点id
          pageAliase: ''
        },
        listLoading: false,
        siteList: [],
        total: 0,
        list: [{
          "siteId": "5a751fab6abb5044e0d19ea1",
          "pageId": "5a754adf6abb500ad05688d9",
          "pageName": "index.html",
          "pageAliase": "首页",
          "pageWebPath": "/index.html",
          "pageParameter": null,
          "pagePhysicalPath": "F:\\develop\\xc_portal_static\\",
          "pageType": "0",
          "pageTemplate": null,
          "pageHtml": null,
          "pageStatus": null,
          "pageCreateTime": "2018-02-03T05:37:53.256+0000",
          "templateId": "5a962b52b00ffc514038faf7",
          "pageParams": null,
          "htmlFileId": "5a7c1c54d019f14d90a1fb23",
          "dataUrl": null
        }]
      }
    },
    methods: {
      formatCreatetime(row, column) {
        var createTime = new Date(row.pageCreateTime);
        if (createTime) {
          return utilApi.formatDate(createTime, 'yyyy-MM-dd hh:mm:ss');
        }
      },
      query() {
        cmsApi.page_list(this.params.page, this.params.size, this.params).then((res) => {
          this.total = res.queryResult.total
          this.list = res.queryResult.list
        })
      },
      resetData() {
        // 清除 响应的数据
        this.params = {
          page: 1, //页码
          size: 5, //每页显示个数
          siteId: '', //站点id
          pageAliase: ''
        }
        this.query();
      },
      changePage(page) {
        // 分页查询
        this.params.page = page;
        this.query();
      },
      querySite() {
        cmsApi.site_list(this.params.page, this.params.size).then((res) => {
          this.siteList = res.queryResult.list;
        })
      },
      edit(pageId){
        this.$router.push({
          path: '/cms/page/edit/'+pageId,
          query:{
            page:this.params.page,
            siteId:this.params.siteId,
            pageAliase: this.params.pageAliase
          }
        });
      },
      del(index, row){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.listLoading = true;
                    let pageId = row.pageId;
                    cmsApi.page_del(pageId).then(res=>{
                      // 使页面加载停止
                       this.listLoading = false;
                      if(res.success){
                         this.$message({
                           type: 'success',
                           message: '删除成功!'
                         });
                         // 刷新页面
                         this.query();
                      }
                    })
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消删除'
                    });
                  });
      },
      generateHtml(id){
        this.$router.push({ path: '/cms/page/html/'+id, query:{
                  page: this.params.page,
                  siteId: this.params.siteId}})
      },
       postPage (id) {
              this.$confirm('确认发布该页面吗?', '提示', {
              }).then(() => {
                this.listLoading = true;
                cmsApi.page_postPage(id).then((res) => {
                  if(res.success){
                    console.log('发布页面id='+id);
                    this.listLoading = false;
                    this.$message.success('发布成功，请稍后查看结果');
                  }else{
                    this.$message.error('发布失败');
                  }
                });
              }).catch(() => {

              });
    }
    },
    created() {
      // 存储请求的参数
      this.params.page = Number.parseInt(this.$route.query.page || 1);
      this.params.siteId = this.$route.query.siteId || '';
      this.params.pageAliase = this.$route.query.pageAliase || '';
      //初始化站点列表
      this.querySite();
    },
    mounted() {
      // 默认查询页面
      this.query();
    }

  }
</script>

<style>
</style>
