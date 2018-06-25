<template>
  <div class="user">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="primary" style="margin-left:8px" icon="plus" @click="onClickAdd">新增</Button>
      </div>
      <div class="body">
        <Table :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

    <!-- add -->
    <Modal v-model="addModal" width="500">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="70">
        <FormItem prop="equipmentno" label="设备号">
          <Input v-model="form.equipmentno" placeholder="请输入设备号"></Input>
        </FormItem>
        <FormItem prop="departmentcode" label="部门编号">
          <Cascader change-on-select @on-change="onSelectDep" :data="casData"></Cascader>
        </FormItem>
        <FormItem prop="merchantcode" label="选择商户">
          <Select v-model="form.merchantcode" :loading="selectLoading" @on-query-change="queryChange">
            <Option v-for="item in merchData" :key="item.id" :value="item.merchantcode">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="areaid" label="所属城市">
          <Select v-model="form.areaid">
            <Option v-for="item in areaData" :key="item.id" :value="item.id">{{item.areaname}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost"  @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>

    <!-- edit -->
    <Modal v-model="editModal" width="500">
      <p slot="header" style="text-align:center">
        <span>修改信息</span>
      </p>
      <Form :model="editData"  :rules="rules" :label-width="77">
        <FormItem prop="equipmentno" label="设备号">
          <Input  v-model="editData.equipmentno" placeholder="请输入设备号"></Input>
        </FormItem>
        <FormItem  label="部门名称">
          <Input v-model="editData.departmentname" readonly placeholder="请输入部门编号"></Input>
        </FormItem>
        <FormItem prop="merchantcode" label="商户">
          <Select v-model="editData.merchantcode">
            <Option v-for="item in merchData" :key="item.id" :value="item.merchantcode">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="areaid" label="所属城市">
          <Select v-model="editData.areaid">
            <Option v-for="item in areaData" :key="item.id" :value="item.id">{{item.areaname}}</Option>
          </Select>
        </FormItem>
        <!-- <FormItem prop="departmentcode" label="部门编号">
          <Input v-model="editData.departmentcode" readonly placeholder="请输入部门编号"></Input>
        </FormItem> -->
        <FormItem label="修改部门为">
          <Cascader change-on-select @on-change="onSelectDepEdit" :data="casData"></Cascader>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost"  @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="edit">保存</Button>
      </div>
    </Modal>

    <!-- qrcode -->
    <Modal v-model="qrModal" width="500">
      <p slot="header" style="text-align:center">
        <span>{{deviceInfo}}</span>
      </p>
      <div style="text-align:center">
        <div  style="text-align:center" id="qrcode" ref="qrcode"></div>
      </div>
      <div class="qrval">
        QRcode Value:
        <code>{{qrcodeVal}}</code>
      </div>
      <div slot="footer">
        <Button type="ghost"  @click="qrModal = false">取消</Button>
        <Button type="primary" @click="qrModal = false">确定</Button>
      </div>
    </Modal>

    <!-- bind -->
    <Modal v-model="bdModal" width="700">
      <p slot="header" style="text-align:center">
        <span>{{seeOneData.equipmentno}}已绑定微信账户</span>
      </p>
      <div>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>头像</th>
              <th>昵称</th>
              <th>性别</th>
              <th>openid</th>
              <th>是否关注</th>
              <th>移除</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in bindPeopleData" :key="item.openid">
              <td><img class="headimg" :src="item.headimgurl" alt=""></td>
              <td>{{item.nickname}}</td>
              <td>{{item.sex == '1' ? '男' : '女'}}</td>
              <td>{{item.openid}}</td>
              <td>
                <Tag v-if="item.subscribe == 1" type="border" color="green">已关注</Tag>
                <Tag v-else type="border" color="yellow">未关注</Tag>
              </td>
              <td><a href="javascript:void(0)" @click="removeBindPeople(item.openid)">移除</a></td>
            </tr>
            <tr v-if="bindPeopleData.length==0">
              <td colspan="6" style="text-align:center">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer">
        <Button type="ghost"  @click="bdModal = false">取消</Button>
        <Button type="primary" @click="bdModal = false">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import QRCode from 'qrcodejs2'
export default {
  name: 'Device',
  data () {
    return {
      searchKey: '',
      addModal: false,
      editModal: false,
      qrModal: false,
      modal_loading: false,
      bdModal: false,
      count: 0,
      page: 1,
      pageSize: 10,
      selectLoading: false,
      form: {
        departmentcode: '',
        equipmentno: '',
        merchantcode: '',
        areaid: ''
      },
      deviceInfo: '',
      rules: {
        departmentcode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        equipmentno: [{ required: true, message: '不能为空', trigger: 'blur' }],
        merchantcode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        // areaid: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      editData: {},
      casData: [],
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80
        },
        {
          title: '设备号ID',
          key: 'equipmentno',
        },
        {
          title: '部门',
          key: 'departmentname',
        },
        {
          title: '商户',
          key: 'merchantname',
        },
        {
          title: '地区',
          key: 'areaname',
          width: 130,
        },
        {
          title: '收款二维码',
          key: 'id',
          width: 110,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'qr-scanner'
                },
                on: {
                  click: () => {
                    this.qrcode(params.row.id, params.row.equipmentno, params.row.areaid)
                  }
                }
              }, '二维码')
            ])
          }
        },
        {
          title: '绑定二维码',
          key: 'id',
          width: 110,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'qr-scanner'
                },
                on: {
                  click: () => {
                    this.bdQrcode(params.row.equipmentno)
                  }
                }
              }, '二维码')
            ])
          }
        },
        {
          title: '绑定管理',
          key: 'id',
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'ios-people'
                },
                on: {
                  click: () => {
                    this.seeBdPeople(params.row)
                  }
                }
              }, '查看绑定')
            ])
          }
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 170,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                  props: {
                    type: 'text',
                    size: 'small',
                    icon: 'edit'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.onClickEdit(params.row)
                    }
                  }
              }, '编辑'),
              h('Button', {
                  props: {
                    type: 'text',
                    size: 'small',
                    icon: 'trash-a'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.id)
                    }
                  }
              }, '删除')
            ])
          }
        }
      ],
      tableData: [],
      qrUrl: '',
      merchData: [],
      bindPeopleData: [],
      seeOneData: {},
      areaData: [],
      qrPreFix: 'https://api.qrserver.com/v1/create-qr-code/?size=480x440&data=',
      qrCodeInit: null,
      qrcodeVal: ''
    }
  },
  components: {
    QRCode
  },
  created () {
    this.getTableData(1, 10, '')
    this.getDepData()
    this.getMerchData(1, 100, '')
    this.getAreaData()
  },
  mounted () {
    this.$nextTick(() => {
      this.qrCodeInit = new QRCode('qrcode', {
        width: 390,
        height: 350,
        text: 'loading...',
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      })
    })
  },
  methods: {
    getTableData (page, size, key) {
      let d = {
        pagesize: size,
        page: page,
        like: key,
        userid: sessionStorage.userid
      }
      this.$store.commit('pageLoading', true)
      serverApi('/Equipment/index', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.result
            this.count = response.data.data.counts
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
        }
      )
    },
    getDepData () {
      serverApi('/depar/index', '',
        response => {
          if (response.data.code === 0){
            let cas = response.data.data
            let getCas = function (arr) {
              arr.forEach(item => {
                item.label = item.departmentname,
                item.value = item.departmentcode
                item.children = item.child
                if (item.child.length > 0) {
                  getCas(item.child)
                }
              })
            }
            getCas(cas)
            this.casData = cas
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    getAreaData () {
      serverApi('/area/index', '',
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.areaData = response.data.data
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    getMerchData (page, size, key) {
      let d = {
        pageSize: size,
        page: page,
        like: key,
        userid: sessionStorage.userid
      }
      this.selectLoading = true
      serverApi('/Merchant/index', d,
        response => {
          // console.log(response)
          this.selectLoading = false
          if (response.data.code === 0){
            this.merchData = response.data.data.result
            this.count = response.data.data.counts
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.selectLoading = false
          console.log(error)
        }
      )
    },
    onClickAdd () {
      this.$refs.form.resetFields()
      this.addModal = true
    },
    onClickEdit (row) {
      this.editData = Object.assign({}, row)
      this.editModal = true
    },
    onSelectDep (e) {
      if (e && e.length) {
        this.form.departmentcode = String(e[e.length-1])
      }
    },
    edit () {
      let reg = /[\W]/g
      if (reg.test(this.editData.equipmentno)) {
        this.$Message.info('设备号不允许出现汉字等非法字符！')
        return false
      }
      delete this.editData._index
      delete this.editData._rowKey
      delete this.editData.createtime
      // delete this.editData.deparmentname
      delete this.editData.merchantname
      this.modal_loading = true
      serverApi('/Equipment/edit', this.editData,
        response => {
          // console.log(response)
          this.modal_loading = false
          if (response.data.code === 0) {
            this.editModal = false
          }
          this.$Message.info(response.data.msg)
          this.getTableData(this.page, this.pageSize, this.searchKey)
        },
        error => {
          console.log(error)
          this.modal_loading = false
        }
      )
    },
    remove (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条信息？</p>',
        onOk: () => {
          serverApi('/Equipment/del', {id: id},
            response => {
              this.$Message.info(response.data.msg)
              this.getTableData(this.page, this.pageSize, this.searchKey)
            },
            error => {
              console.log(error)
              this.$Message.error('链接失败！')
            }
          )
        }
      })
    },
    add () {
      let reg = /[\W]/g
      if (reg.test(this.form.equipmentno)) {
        this.$Message.info('设备号不允许出现汉字等非法字符！')
        return false
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.modal_loading = true
          serverApi('/Equipment/add', this.form,
            response => {
              this.modal_loading = false
              if (response.data.code === 0) {
                this.addModal = false
                this.getTableData(this.page, this.pageSize, this.searchKey)
              }
              this.$Message.info(response.data.msg)
            },
            error => {
              console.log(error)
              this.modal_loading = false
            }
          )
        }
      })
    },
    exportTable () {
      if (this.searchData.length > 0) {
        exportExcel(this.searchData, 'Api表格导出')
      } else {
        this.$Message.info('无数据！！')
      }
    },
    changePage (e) {
      this.page = e
      this.getTableData(e, this.pageSize, this.searchKey)
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData(this.page, e, this.searchKey)
    },
    onClickSearch () {
      this.getTableData(this.page, this.pageSize, this.searchKey)
    },
    onSelectDepEdit (e) {
      if (e && e.length) {
        this.editData.departmentcode = e[e.length-1]
      }
    },
    qrcode (id, code, areaid) {
      let qrData = 'http://h5.cqyyy.cn/payment.html?deviceid=' + id + '&city=' + areaid
      // this.qrUrl = this.qrPreFix + encodeURIComponent(qrData)
      this.qrCodeInit.makeCode(qrData)
      this.qrcodeVal = qrData
      this.deviceInfo = code + '收款二维码'
      this.qrModal = true
    },
    bdQrcode (id) {
      let qrData ='http://server.cqyyy.cn/index.php/admin/login/equimentbingding/departmentcode/' + id
      this.qrcodeVal = qrData
      this.qrCodeInit.makeCode(qrData)
      this.deviceInfo = id + '绑定微信账号二维码'
      this.qrModal = true
    },
    queryChange (e) {
      // this.getMerchData(1, 30, e)
    },
    seeBdPeople (row) {
      this.seeOneData = row
      serverApi('/equipment/getequipmentinfo', {equipmentno: row.equipmentno},
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.bindPeopleData = response.data.data
            this.bdModal = true
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    removeBindPeople (openid) {
      let d = {
        equiptmentno: this.seeOneData.equipmentno,
        openid: openid
      }
      serverApi('/equipment/delopenid', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.getBindPeople(this.seeOneData.equipmentno)
            this.$Message.success('移除成功！')
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    getBindPeople (code) {
      serverApi('/equipment/getequipmentinfo', {equipmentno: code},
        response => {
          if (response.data.code === 0){
            this.bindPeopleData = response.data.data
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.head{
  padding-bottom: 12px;
}
.device-info{
  text-align: center;
  font-size: 18px;
  margin: 10px;
}
.headimg{
  width: 30px;
  height: 30px;
  border-radius: 50%;
  vertical-align: top;
}
.qrval{
  margin-top: 12px;
  font-size: 14px;
  background-color: #f3f3f3;
  padding: 10px 6px;
  code{
    font-size: 12px;
    word-break: break-all;
  }
}
#qrcode{
  display: flex;
  justify-content: center;
}
</style>
