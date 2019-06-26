<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form :label-width="60">
        <Row>
          <Col span="4">
            <FormItem label="搜索类别" style="margin-bottom:0" label-width="70">
              <Select v-model="searchObj.waretype" clearable placeholder="选择类别">
                <Option
                  v-for="(item, index) in waretypelist"
                  :key="index"
                  :value="item.name"
                >{{item.value}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="搜索等级" style="margin-bottom:0" label-width="70">
              <Select v-model="searchObj.gradeid" clearable placeholder="选择等级">
                <Option
                  v-for="(item, index) in gradeidlist"
                  :key="index"
                  :value="item.id"
                >{{item.gradename}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="搜索类型" style="margin-bottom:0" label-width="70">
              <Select v-model="searchObj.buytype" clearable placeholder="选择类型">
                <Option
                  v-for="(item, index) in buytypelist"
                  :key="index"
                  :value="item.name"
                >{{item.value}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem style="margin-bottom:0">
              <Button @click="getTableData" type="primary" :loading="isloading" icon="md-search">查询</Button>
              <Button type="primary" style="margin-left:10px" icon="md-add" @click="onClickAdd">新增</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>

    <Card :bordered="false" style="margin-top:10px">
      <Table :columns="columns" :data="tableData"></Table>
      <div style="float: right; padding-top:12px">
        <Page
          :total="total"
          show-total
          :current="page"
          @on-change="changePage"
          show-sizer
          @on-page-size-change="onChangeSize"
        ></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

    <Modal v-model="addModal" width="500">
      <p slot="header" style="text-align:center">
        <span>新增限购</span>
      </p>
      <Form :model="addData" ref="form" :rules="rules" :label-width="85">
        <Row>
          <Col span="24">
            <FormItem label="商品类别" prop="waretype">
              <Select
                v-model="addData.waretype"
                filterable
                placeholder="选择商品类别"
                @on-change="clearWarename"
              >
                <Option
                  v-for="(item, index) in waretypelist"
                  :key="index"
                  :value="item.name"
                >{{item.value}}</Option>
              </Select>
            </FormItem>
            <FormItem label="商品名字" prop="warename">
              <Select
                v-model="addData.warename"
                transfer
                remote
                filterable
                clearable
                :loading="wareidloading"
                :remote-method="getWareidData"
                placeholder="选择商品名称"
              >
                <Option
                  v-for="(item, index) in wareidlist"
                  :key="index"
                  :value="item.goodsname || item.cardname"
                >{{item.goodsname || item.cardname}}</Option>
              </Select>
            </FormItem>
            <FormItem label="会员等级" prop="gradeid">
              <Select v-model="addData.gradeid" clearable placeholder="选择会员等级">
                <Option
                  v-for="(item, index) in gradeidlist"
                  :key="index"
                  :value="item.id"
                >{{item.gradename}}</Option>
              </Select>
            </FormItem>
            <FormItem label="购买类型" prop="buytype">
              <Select v-model="addData.buytype" clearable placeholder="选择购买类型">
                <Option
                  v-for="(item, index) in buytypelist"
                  :key="index"
                  :value="item.name"
                >{{item.value}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onSave">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import serverApi from "../../axios";
export default {
  name: "UserMemberGovern",
  data() {
    return {
      searchObj: {
        waretype: "",
        gradeid: "",
        buytype: ""
      },
      waretypelist: [
        {
          name: 0,
          value: "邮购商品"
        },
        {
          name: 1,
          value: "团购商品"
        }
      ],
      gradeidlist: [],
      total: 0,
      pagesize: 10,
      page: 1,
      tableData: [],
      columns: [
        {
          title: "#",
          key: "id",
          width: 80
        },
        {
          title: "商品ID",
          key: "wareid"
        },
        {
          title: "商品名称",
          key: "warename"
        },
        {
          title: "商品类别",
          key: "waretype"
        },
        {
          title: "会员等级",
          key: "gradeid"
        },
        {
          title: "购买类型",
          key: "buytype"
        },
        {
          title: "操作",
          key: "id",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.onClickDel(params.row);
                  }
                },
                style: {
                  color: "#f90"
                }
              },
              "删除"
            );
          }
        }
      ],
      addModal: false,
      addData: {
        wareid: "",
        waretype: "",
        gradeid: "",
        buytype: "",
        warename: ""
      },
      buytypelist: [],
      rules: {
        wareid: [
          {
            required: true,
            message: "请输入等级名称",
            trigger: "blur",
            type: "number"
          }
        ],
        waretype: [
          {
            required: true,
            message: "请输入等级经验值",
            trigger: "blur",
            type: "number"
          }
        ],
        gradeid: [
          {
            required: true,
            message: "请输入等级经验值",
            trigger: "blur",
            type: "number"
          }
        ],
        buytype: [
          {
            required: true,
            message: "请输入等级经验值",
            trigger: "blur",
            type: "number"
          }
        ],
        warename: [
          { required: true, message: "请输入等级经验值", trigger: "blur" }
        ]
      },
      modal_loading: false,
      isloading: false,
      wareidloading: false,
      wareidlist: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.searchObj.page = this.page;
      this.searchObj.pagesize = this.pagesize;
      this.isloading = true;
      // list
      serverApi(
        "/member/governlist",
        this.searchObj,
        response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data.data;
            this.total = response.data.data.total;
          } else {
            this.$Message.warning(response.data.msg);
          }
          this.isloading = false;
          this.searchObj = {
            wareid: "",
            waretype: "",
            gradeid: ""
          };
        },
        error => {
          console.log(error);
          this.isloading = false;
          this.searchObj = {
            wareid: "",
            waretype: "",
            gradeid: ""
          };
        }
      );
      //vip level list
      serverApi(
        "/member/usergradelist",
        null,
        response => {
          if (response.data.code === 0) {
            this.gradeidlist = response.data.data;
          } else {
            this.$Message.warning(response.data.msg);
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    getWareidData(key) {
      let d = {
        like: key,
        pagesize: 10
      };
      this.waretypeloading = true;
      switch (this.addData.waretype) {
        case 0:
          serverApi(
            "/goods/index",
            d,
            response => {
              this.waretypeloading = false;
              if (response.data.code === 0) {
                this.wareidlist = response.data.data.result;
              } else {
                this.$Message.warning(response.data.msg);
              }
            },
            error => {
              this.waretypeloading = false;
              this.$Message.warning(response.data.msg);
              console.log(error);
            }
          );
          break;
        case 1:
          serverApi(
            "/card/coupon",
            d,
            response => {
              this.waretypeloading = false;
              if (response.data.code === 0) {
                this.wareidlist = response.data.data.result;
              } else {
                this.$Message.warning(response.data.msg);
              }
            },
            error => {
              this.waretypeloading = false;
              this.$Message.warning(response.data.msg);
            }
          );
          break;
      }
    },
    clearWarename() {
      this.addData.warename = "";
      this.addData.wareid = "";
      this.addData.gradeid = "";
      this.addData.buytype = "";
      this.wareidlist = [];
    },
    onClickAdd() {
      this.addModal = true;
      //buyType list
      serverApi(
        "/member/buytypelist",
        null,
        response => {
          if (response.data.code === 0) {
            this.buytypelist = response.data.data;
          } else {
            this.$Message.warning(response.data.msg);
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    changePage(e) {
      this.page = e;
      this.getTableData();
    },
    onChangeSize(e) {
      this.pagesize = e;
      this.getTableData();
    },
    onClickDel(row) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除此条规则？",
        onOk: () => {
          serverApi(
            "/member/governdel",
            { id: row.id },
            response => {
              if (response.data.code === 0) {
                this.getTableData();
              }
              this.$Message.success(response.data.msg);
            },
            error => {
              this.$Message.error(error.data.msg);
            }
          );
        }
      });
    },
    onSave() {
      this.addData.wareid = this.wareidlist[0].id;
      this.$refs.form.validate(val => {
        if (val) {
          this.modal_loading = true;
          serverApi(
            "/member/governadd",
            this.addData,
            response => {
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg);
                this.getTableData();
                this.addData = {
                  wareid: "",
                  waretype: "",
                  gradeid: "",
                  buytype: "",
                  warename: ""
                };
                this.modal_loading = false;
              } else {
                this.modal_loading = false;
                this.$Message.warning(response.data.msg);
              }
              this.addModal = false;
            },
            error => {
              this.modal_loading = false;
              this.$Message.error(error.data.msg);
              this.addData = {
                wareid: "",
                waretype: "",
                gradeid: "",
                buytype: "",
                warename: ""
              };
            }
          );
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>