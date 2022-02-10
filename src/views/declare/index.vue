<template>
  <div>
    <h3 style="text-align: center">官厂乡高庄返乡自助申报登记信息系统</h3>
    <div style="padding-right: 10px">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNum">
          <el-input v-model="ruleForm.idNum" />
        </el-form-item>
        <el-form-item label="在外工作单位" prop="work">
          <el-input v-model="ruleForm.work" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="ruleForm.phone" />
        </el-form-item>
        <el-form-item label="户籍地址" prop="address">
          <el-input v-model="ruleForm.address" />
        </el-form-item>
        <el-form-item label="市外详细地址" prop="outAddress">
          <el-input v-model="ruleForm.outAddress" />
        </el-form-item>
        <el-form-item label="是否反原" prop="isReback">
          <el-radio-group v-model="ruleForm.isReback">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
            <el-radio label="2">未定</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="返原时间" prop="rebackTime">
          <el-input v-model="ruleForm.rebackTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { save } from '@/api/declare'
export default {
  name: 'Declare',
  data() {
    return {
      ruleForm: {
        name: '',
        sex: '1',
        idNum: '',
        work: '',
        phone: '',
        address: '河南省新乡市原阳县官厂乡高庄村',
        outAddress: '',
        isReback: '1',
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
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            FullName: this.ruleForm.name,
            Sex: this.ruleForm.sex,
            IdCard: this.ruleForm.idNum,
            Company: this.ruleForm.work,
            PhoneNumber: this.ruleForm.phone,
            Household: this.ruleForm.address,
            OutSide: this.ruleForm.outAddress,
            IsYuan: this.ruleForm.isReback,
            OutCityTime: this.ruleForm.rebackTime
          }
          save(params).then(res => {
            this.$message.success('您的信息已经提交，请自行关闭窗口！')
            this.$refs[formName].resetFields()
          }).catch(() => {
            this.$message.error('信息提交失败，请联系相关负责人！')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
