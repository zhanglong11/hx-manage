
## 项目使用了 vue-admin-template 相关配置 可以查看 https://github.com/PanJiaChen/vue-admin-template

预览地址： http://d-server-42:8105/ 

### 使用 npm run release 命令发布到公司本地服务器

### 使用了 git hook 在提交前进行 eslint 检查

请先配置 eslint 

### 全局变量

\_ lodash 

moment 日期格式化

### 注册在 vue 实例上的 全局组件

Upload

Download

Preview

Table

Flow

### 注册在 vue 实例上的全局方法

\_ lodash

moment 日期格式化

axios 封装的 axios 请求

$moneyFormat

### 文件内容

src/main.js 入口文件
src/permission.js 路由守卫



### 附件管理组件

manage ：是否显示上传、删除按钮

``` vue
<vxe-table-column title="附件" field="fileIds">
     <template v-slot="{ row }">
         <AttachmentDialog manage :ids.sync="row.fileIds"></AttachmentDialog>
      </template>
</vxe-table-column>
```



如图，没有附件的时候会显示没有附件

![image-20200309114512924](http://static.doveaz.xyz/img/image-20200309114512924.png)

![image-20200309181501293](http://static.doveaz.xyz/img/image-20200309181501293.png)

点击文件名可以预览

### 参数选择器
1 在系统参数中添加所需的参数分组，然后添加选项，option的值将会和argCode关联

2 在store/modules/arg.js 中添加对应的 argGroup（如图所示）

![image-20200408150859128](http://static.doveaz.xyz/img/image-20200408150859128.png)

3 使用SelectArg (已注册在全局)

```vue
<SelectArg v-model="form.blabla" argGroup="workerProperty" />
```

4 带颜色状态的字段

建议使用Status组件(已注册在全局)

```html
<Status argGroup="workerProperty" :value="jobStatus" />
```

