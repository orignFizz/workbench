<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.FullName" size="small" clearable placeholder="请输入姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="getData" />
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="getData">
        搜索
      </el-button>
      <el-button size="small" :loading="downloadLoading" title="包含身份证号" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleDownload(1)">
        导出表格
      </el-button>
      <el-button size="small" :loading="downloadLoading" title="不包含身份证号" style="margin:0 0 20px 20px;" type="danger" icon="el-icon-document" @click="handleDownload()">
        核对人员信息表格
      </el-button>
      <el-button size="small" icon="el-icon-plus" @click="handleCreate">新建</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="datas"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="small"
    >
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="FullName" width="100" />
      <el-table-column label="性别" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Sex === 0 ? '女' : '男' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" prop="IdCard" />
      <el-table-column label="在外工作单位" prop="Company" />
      <el-table-column label="联系方式" prop="PhoneNumber" align="center" />
      <el-table-column label="户籍地址" prop="Household" />
      <el-table-column label="市外详细地址" prop="OutSide" />
      <el-table-column label="是否返原" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.IsYuan | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返原时间" prop="OutCityTime" width="120" align="center" />
      <el-table-column
        fixed="right"
        width="180"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(scope.row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px" top="4vh">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="temp.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNum">
          <el-input v-model="temp.idNum" />
        </el-form-item>
        <el-form-item label="在外工作单位" prop="work">
          <el-input v-model="temp.work" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="户籍地址" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>
        <el-form-item label="市外详细地址" prop="outAddress">
          <el-input v-model="temp.outAddress" />
        </el-form-item>
        <el-form-item label="是否反原" prop="isReback">
          <el-radio-group v-model="temp.isReback">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
            <el-radio :label="2">未定</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="返原时间" prop="rebackTime">
          <el-input v-model="temp.rebackTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('dataForm')">提交</el-button>
          <el-button @click="resetForm('dataForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog></div>
</template>

<script>
import { list, del, save } from '@/api/declare'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '否',
        1: '是',
        2: '暂定'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listQuery: {
        FullName: ''
      },
      downloadLoading: false,
      listLoading: false,
      dialogFormVisible: false,
      datas: [],
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogStatus: 'create',
      temp: {
        name: '',
        sex: 1,
        idNum: '',
        work: '',
        phone: '',
        address: '河南省新乡市原阳县官厂乡高庄村',
        outAddress: '',
        isReback: 1,
        rebackTime: ''
      },
      ruleForm: {
        name: '',
        sex: 1,
        idNum: '',
        work: '',
        phone: '',
        address: '河南省新乡市原阳县官厂乡高庄村',
        outAddress: '',
        isReback: 1,
        rebackTime: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        idNum: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入户籍地址', trigger: 'blur' }
        ],
        outAddress: [
          { required: true, message: '请输入市外地址', trigger: 'blur' }
        ],
        rebackTime: [
          { required: true, message: '请输入返原时间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const params = {
        pageIndex: 1,
        pageSize: 10000,
        FullName: this.listQuery.FullName
      }
      list(params).then(res => {
        if (res.Code === 200) {
          this.datas = res.Data
          this.datas.forEach(m => {
            m.name = m.FullName
            m.sex = m.Sex
            m.idNum = m.IdCard
            m.work = m.Company
            m.phone = m.PhoneNumber
            m.address = m.Household
            m.outAddress = m.OutSide
            m.isReback = m.IsYuan
            m.rebackTime = m.OutCityTime
          })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            FullName: this.temp.name,
            Sex: this.temp.sex,
            IdCard: this.temp.idNum,
            Company: this.temp.work,
            PhoneNumber: this.temp.phone,
            Household: this.temp.address,
            OutSide: this.temp.outAddress,
            IsYuan: this.temp.isReback,
            OutCityTime: this.temp.rebackTime
          }
          if (this.temp.ID && this.temp.ID !== '') params.ID = this.temp.ID
          save(params).then(res => {
            this.$message.success('操作成功')
            this.dialogFormVisible = false
            this.getData()
          }).catch(() => {
            this.$message.error('信息提交失败，请联系相关负责人！')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetTemp() {
      this.temp = {
        name: '',
        sex: 1,
        idNum: '',
        work: '',
        phone: '',
        address: '河南省新乡市原阳县官厂乡高庄村',
        outAddress: '',
        isReback: 1,
        rebackTime: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDel(id) {
      this.$confirm('确定要删除该项么', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          del(id).then(res => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getData()
          })
        })
        .catch(() => { this.$message.warning('取消操作') })
    },
    handleDownload(isIdNum) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = isIdNum === 1 ? ['姓名', '性别', '身份证号', '工作单位', '联系方式', '户籍地址', '市外详细地址', '是否返原', '返原时间'] : ['姓名', '性别', '工作单位', '联系方式', '户籍地址', '市外详细地址', '是否返原', '返原时间']
        const filterVal = isIdNum === 1 ? ['name', 'sex', 'idNum', 'work', 'phone', 'address', 'outAddress', 'isReback', 'rebackTime'] : ['name', 'sex', 'work', 'phone', 'address', 'outAddress', 'isReback', 'rebackTime']
        const list = this.datas
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '高庄村在外返原详情',
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'sex') {
          return v.sex === '0' ? '女' : '男'
        } else if (j === 'isReback') {
          const statusMap = {
            0: '否',
            1: '是',
            2: '暂定'
          }
          return statusMap[v[j]]
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
