<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form :label-width="60">
        <Row>
          <Col span="4">
            <FormItem label="搜索ID" style="margin-bottom:0" label-width="50">
              <Input placeholder="搜索..." v-model="searchObj.wareid"></Input>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="搜索类别" style="margin-bottom:0" label-width="70">
              <Input placeholder="搜索..." v-model="searchObj.waretype"></Input>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="搜索等级" style="margin-bottom:0" label-width="70">
              <Input placeholder="搜索..." v-model="searchObj.gradeid"></Input>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="搜索名称" style="margin-bottom:0" label-width="70">
              <Input placeholder="搜索..." v-model="searchObj.warename"></Input>
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

    <Modal v-model="addModal" width="450">
      <p slot="header" style="text-align:center">
        <span>新增等级</span>
      </p>
      <Form :model="addData" ref="form" :rules="rules" :label-width="85">
        <Row>
          <Col span="24">
            <FormItem label="商品ID/卡券ID/活动ID" prop="wareid">
              <Input v-model="addData.wareid"></Input>
            </FormItem>
            <FormItem label="商品类别" prop="waretype">
              <Input v-model="addData.waretype"></Input>
            </FormItem>
            <FormItem label="会员等级" prop="gradeid">
              <Input v-model="addData.gradeid"></Input>
            </FormItem>
            <FormItem label="购买类型" prop="buytype">
              <Input v-model="addData.buytype"></Input>
            </FormItem>
            <FormItem label="商品名字" prop="warename">
              <Input v-model="addData.warename"></Input>
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
        wareid: "",
        waretype: "",
        gradeid: "",
        warename: ""
      },
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
      rules: {
        wareid: [
          { required: true, message: "请输入等级名称", trigger: "blur" }
        ],
        waretype: [
          { required: true, message: "请输入等级经验值", trigger: "blur" }
        ],
        gradeid: [
          { required: true, message: "请输入等级经验值", trigger: "blur" }
        ],
        buytype: [
          { required: true, message: "请输入等级经验值", trigger: "blur" }
        ],
        warename: [
          { required: true, message: "请输入等级经验值", trigger: "blur" }
        ]
      },
      modal_loading: false,
      isloading: false
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
      serverApi("/member/governlist", this.searchObj,
        response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data.data;
            this.total = response.data.data.total;
          } else {
            this.$Message.warning(response.data.msg);
            this.searchObj = { wareid: "", waretype: "", gradeid: "", warename: "" };
          }
          this.isloading = false;
        },
        error => {
          console.log(error);
          this.isloading = false;
          this.searchObj = { wareid: "", waretype: "", gradeid: "", warename: "" };
        }
      );
    },
    onClickAdd() {
      this.addModal = true;
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
          serverApi("/member/governdel", { id: row.id },
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
      this.$refs.form.validate(val => {
        if (val) {
          this.modal_loading = true;
          serverApi("/member/governadd", this.addData,
            response => {
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg);
                this.getTableData();
                this.addData = { wareid: "", waretype: "", gradeid: "", buytype: "", warename: "" };
              } else {
                this.$Message.warning(response.data.msg);
              }
              this.addModal = false;
              this.modal_loading = false;
            },
            error => {
              this.modal_loading = false;
              this.$Message.error(error.data.msg);
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
