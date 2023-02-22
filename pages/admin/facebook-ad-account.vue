<template>
  <v-container fluid>
    <v-file-input
      class="d-none"
      :accept="accept"
      ref="uploadFile"
      v-model="file"
      @change="fileChange"
    />
    <v-data-table
      :items="list"
      item-key="_id"
      :headers="headers"
      :loading="loading"
      class="elevation-1"
      :options.sync="options"
      :server-items-length="totalCount"
      :footer-props="require('@/assets/json/footer-props.json')"
    >
      <template #top>
        <v-toolbar flat>
          <v-btn color="secondary" dark class="mr-2" @click="getList">
            <v-icon left> mdi-refresh </v-icon>刷新
          </v-btn>
          <v-dialog v-model="dialogDelete" width="auto">
            <v-card>
              <v-card-title class="text-h5">
                {{ `你确定要删除这${listItem.length || ''}条信息吗?` }}
              </v-card-title>
              <v-card-actions>
                <v-spacer />
                <v-btn color="secondary" @click="dialogDelete = false">
                  取消
                </v-btn>
                <v-btn color="primary" @click="deleteItemConfirm">确定</v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider />
      </template>

      <template #[`item._id`]="{ item }">
        <span @click.stop="$copy(item._id)">
          {{ item._id }}
        </span>
      </template>

      <template #[`item.accountType`]="{ item }">
        <v-chip
          label
          small
          text-color="white"
          :color="item.initialCharge ? 'primary' : 'success'"
        >
          {{ item.initialCharge ? '海外户' : '国内户' }}
        </v-chip>
      </template>

      <template #[`item.createdAt`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              {{ item.createdAt | format }}
            </span>
          </template>
          <span>{{ item.createdAt }}</span>
        </v-tooltip>
      </template>

      <template #[`item.updatedAt`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              {{ item.updatedAt | format }}
            </span>
          </template>
          <span>{{ item.updatedAt }}</span>
        </v-tooltip>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn
          fab
          x-small
          class="mr-2"
          min-width="0"
          color="primary"
          @click.stop="editItem(item)"
        >
          <v-icon small> mdi-pencil </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog persistent v-model="dialog" max-width="720" scrollable>
      <v-card>
        <v-toolbar dense>
          <span class="headline">{{ formTitle }}开户信息</span>
          <v-spacer />
          <v-icon @click="closeAdd">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-stepper v-model="e1">
                <v-stepper-header>
                  <v-stepper-step step="1" :complete="e1 > 1">
                    创建账户
                  </v-stepper-step>
                  <v-divider />
                  <v-stepper-step step="2" :complete="e1 > 2">
                    输入公司信息
                  </v-stepper-step>
                  <v-divider />
                  <v-stepper-step step="3"> 添加账户详情 </v-stepper-step>
                </v-stepper-header>
                <v-stepper-items>
                  <v-stepper-content step="1">
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="姓"
                          :rules="[rules.required]"
                          v-model="listItem.lastName"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="名"
                          :rules="[rules.required]"
                          v-model="listItem.firstName"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-autocomplete
                          dense
                          outlined
                          hide-details
                          label="性别"
                          :rules="[rules.required]"
                          v-model="listItem.sex"
                          :items="['男', '女']"
                        />
                      </v-col>
                      <v-col cols="6">
                        <DatePicker label="生日" v-model="listItem.birthday" />
                      </v-col>
                    </v-row>
                  </v-stepper-content>
                  <v-stepper-content step="2">
                    <v-row>
                      <v-col cols="12">
                        <v-row>
                          <v-col cols="3">
                            <v-subheader>行业类型</v-subheader>
                          </v-col>
                          <v-col cols="9">
                            <v-autocomplete
                              dense
                              outlined
                              hide-details
                              label="行业类型"
                              :rules="[rules.required]"
                              v-model="listItem.industry"
                              :items="require('@/assets/json/industries.json')"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="营业执照"
                          placeholder="营业执照图片地址"
                          :rules="[rules.required]"
                          v-model="listItem.businessLicense"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-tooltip top>
                          <template #activator="{ on, attrs }">
                            <v-btn
                              block
                              v-on="on"
                              v-bind="attrs"
                              color="primary"
                              :disabled="uploading"
                              @click="uploadFile('businessLicense')"
                            >
                              <v-icon left v-if="listItem.businessLicense">
                                mdi-image
                              </v-icon>
                              上传营业执照
                            </v-btn>
                          </template>
                          <v-img
                            max-height="320"
                            max-width="320"
                            v-if="listItem.businessLicense"
                            :src="listItem.businessLicense"
                            :lazy-src="listItem.businessLicense"
                          />
                          <span v-else>请上传图片</span>
                        </v-tooltip>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="营业执照信息"
                          placeholder="请准确输入营业执照上的编号"
                          :rules="[rules.required]"
                          v-model="listItem.businessLicenseInfo"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="公司名称"
                          placeholder="请准确输入营业执照上显示的公司名称。这将是你商务管理平台账户的名称。"
                          :rules="[rules.required]"
                          v-model="listItem.companyName"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="公司英文名称（非必要）"
                          placeholder="请输入公司的英文名称"
                          v-model="listItem.companyEnglishName"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="公司邮箱"
                          placeholder="如果有关于你公司的重要更新，我们会使用你提供的邮箱联系你"
                          :rules="[rules.required]"
                          v-model="listItem.email"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="公司注册地址"
                          placeholder="请准确输入营业执照上的完整地址"
                          :rules="[rules.required]"
                          v-model="listItem.address"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="注册地址的邮编"
                          :rules="[rules.required]"
                          v-model="listItem.postcode"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="公司注册地址所在城市的英文名称"
                          :rules="[rules.required]"
                          v-model="listItem.city"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="官方网址"
                          placeholder="请输入公司的官方网站。如果没有网站，你可以输入电商网站或应用商店链接。"
                          :rules="[rules.required]"
                          v-model="listItem.website"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="文件地址"
                          placeholder="[可选]请提供补充文件来证明网店或公司的所有权。"
                          v-model="listItem.attachment"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-tooltip top>
                          <template #activator="{ on, attrs }">
                            <v-btn
                              block
                              v-on="on"
                              v-bind="attrs"
                              color="primary"
                              :disabled="uploading"
                              @click="uploadFile('attachment')"
                            >
                              <v-icon left v-if="listItem.attachment">
                                mdi-file
                              </v-icon>
                              上传其他支持性文件
                            </v-btn>
                          </template>
                          <span v-if="listItem.attachment">
                            {{ listItem.attachment }}
                          </span>
                          <span v-else>请上传证明文件</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-stepper-content>
                  <v-stepper-content step="3">
                    <v-row>
                      <v-col cols="12">
                        <p class="font-weight-black">商务管理平台</p>
                        <p class="body-1">
                          商务管理平台是一款Meta工具，旨在帮助你运营和管理公司业务。
                        </p>
                        <p class="body-2">
                          你的商务管理平台账户和你的公司名称相关联。若要更改，请前往公司详情页面，并更改你输入的公司名称。
                        </p>
                        <v-text-field
                          dense
                          disabled
                          outlined
                          clearable
                          hide-details
                          v-model="listItem.companyName"
                        />
                      </v-col>
                      <v-col cols="12">
                        <p class="font-weight-black">广告账户</p>
                        <p class="body-1">
                          广告账户是你支付广告费用和保存广告的地方。我们建议选择广告受众所在地的时区，时区设置好后便无法更改。
                        </p>
                        <v-row>
                          <v-col cols="6">
                            <v-text-field
                              dense
                              outlined
                              clearable
                              hide-details
                              label="为广告账户命名"
                              v-model="listItem.adAccount"
                            />
                          </v-col>
                          <v-col cols="6">
                            <v-autocomplete
                              dense
                              outlined
                              clearable
                              hide-details
                              label="时区选择"
                              :rules="[rules.required]"
                              v-model="listItem.timezone"
                              :items="require('@/assets/json/timezones.json')"
                            />
                          </v-col>
                          <v-col cols="12">
                            <p class="font-weight-black">广告目标位置</p>
                            <p class="body-1">
                              请输入你要在Meta推广的所有网站或应用。你的广告账户只能推广你在这里输入的网站或应用。
                            </p>
                            <p class="font-weight-black">
                              你的广告会跳转到哪些网站？
                            </p>
                            <p class="body-1">
                              输入你要在广告中使用的所有网站。
                            </p>
                            <v-text-field
                              dense
                              outlined
                              clearable
                              hide-details
                              :rules="[rules.required]"
                              v-model="listItem.adWebsite"
                            />
                          </v-col>
                          <v-col cols="12">
                            <p class="font-weight-black">
                              你是否需要Meta Pixel像素代码？
                            </p>
                            <p class="body-1">
                              在网站中添加Meta
                              Pixel像素代码，有助于追踪广告转化、改进受众定位，让广告投放回报最大化。你也可以稍后在商务管理平台中创建Pixel像素代码。
                            </p>
                            <v-radio-group v-model="createPixelCode">
                              <v-radio :value="true">
                                <template #label>
                                  <div>是，我想创建Pixel像素代码</div>
                                </template>
                              </v-radio>
                              <v-radio :value="false">
                                <template #label>
                                  <div>我暂时不需要Pixel像素代码</div>
                                </template>
                              </v-radio>
                            </v-radio-group>
                            <v-text-field
                              v-if="createPixelCode"
                              dense
                              outlined
                              clearable
                              hide-details
                              v-model="listItem.pixelCode"
                            />
                          </v-col>
                          <v-col cols="12">
                            <p class="font-weight-black">
                              创建Facebook公共主页
                            </p>
                            <p class="body-1">
                              我们建议使用广告目标受众的语言为Facebook公共主页命名。
                            </p>
                            <v-text-field
                              dense
                              outlined
                              clearable
                              hide-details
                              :rules="[rules.required]"
                              v-model="listItem.facebookPage"
                            />
                          </v-col>
                          <v-col cols="12">
                            <p class="font-weight-black">
                              你的广告跳转到Meta应用的编号是什么？（可选）
                            </p>
                            <p class="body-1">
                              如果广告跳转到应用，则必须提供应用编号。但电商公司不必输入应用编号。
                            </p>
                            <v-text-field
                              dense
                              outlined
                              clearable
                              hide-detail
                              v-model="listItem.metaAppCode"
                            />
                          </v-col>
                          <v-col cols="12">
                            <p class="font-weight-black">广告策划经销商</p>
                            <p class="body-1">你是否在与广告策划经销商合作？</p>
                            <v-radio-group v-model="adAgency">
                              <v-radio :value="false">
                                <template #label>
                                  <div>否，我没有与广告策划经销商合作</div>
                                </template>
                              </v-radio>
                              <v-radio :value="true">
                                <template #label>
                                  <div>是，我有与广告策划经销商合作</div>
                                </template>
                              </v-radio>
                            </v-radio-group>
                            <v-text-field
                              v-if="adAgency"
                              dense
                              outlined
                              clearable
                              hide-details
                              v-model="listItem.adAgencyName"
                              placeholder="请输入广告经销商的公司名称"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn color="primary" :disabled="e1 == 1" @click="e1 -= 1">
            上一步
          </v-btn>
          <v-btn color="secondary" :disabled="stepDisabled" @click="e1 += 1">
            继续
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            :disabled="!valid"
            :loading="loading"
            @click="submit"
          >
            提交
          </v-btn>
          <v-btn color="secondary" @click="closeAdd"> 取消 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="dialog2" max-width="720" scrollable>
      <v-card>
        <v-toolbar dense>
          <span class="headline">{{ formTitle }}Facebook海外广告开户信息</span>
          <v-spacer />
          <v-icon @click="closeAdd">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid2">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    dense
                    outlined
                    clearable
                    hide-details
                    label="公司名称"
                    :rules="[rules.required]"
                    v-model="listItem.companyName"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    dense
                    outlined
                    clearable
                    hide-details
                    label="邮箱"
                    :rules="[rules.required]"
                    v-model="listItem.email"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    dense
                    outlined
                    clearable
                    hide-details
                    label="手机"
                    :rules="[rules.required]"
                    v-model="listItem.phone"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    dense
                    outlined
                    clearable
                    hide-details
                    label="BMID"
                    :rules="[rules.required]"
                    v-model="listItem.bmid"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    outlined
                    auto-grow
                    hide-details
                    row-height="15"
                    :rules="[rules.required]"
                    label="Facebook主页"
                    placeholder="多个主页请使用逗号或换行分开"
                    v-model="listItem.facebookPage"
                  />
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    outlined
                    clearable
                    hide-details
                    label="时区选择"
                    :rules="[rules.required]"
                    v-model="listItem.timezone"
                    :items="require('@/assets/json/timezones.json')"
                  />
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    outlined
                    clearable
                    hide-details
                    label="首充"
                    :rules="[rules.required]"
                    v-model="listItem.initialCharge"
                    :items="['$2000', '$5000', '$10000', '其他']"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            :disabled="!valid2"
            :loading="loading"
            @click="submit"
          >
            提交
          </v-btn>
          <v-btn color="secondary" @click="closeAdd"> 取消 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'facebook-ad-account',
  layout: 'admin',
  data: () => ({
    loading: true,
    uploading: false,
    totalCount: 0,
    options: {
      page: 1,
      itemsPerPage: 10
    },
    headers: [
      {
        text: 'Id',
        value: '_id',
        sortable: false,
        searchable: true
      },
      {
        text: '公司名称',
        value: 'companyName',
        sortable: false
      },
      {
        text: 'Facebook主页',
        value: 'facebookPage',
        sortable: false
      },
      {
        text: 'BMID',
        value: 'bmid',
        sortable: false
      },
      {
        text: '广告时区',
        value: 'timezone',
        sortable: false
      },
      {
        text: '账号类型',
        value: 'accountType',
        sortable: false
      },
      {
        text: '创建时间',
        value: 'createdAt',
        sortable: false
      },
      {
        text: '更新时间',
        value: 'updatedAt',
        sortable: false
      },
      { text: '操作', value: 'actions', sortable: false }
    ],
    e1: 1,
    createPixelCode: true,
    adAgency: false,
    file: null,
    which: null,
    accept: '',
    list: [],
    dialog: false,
    dialog2: false,
    dialogDelete: false,
    valid: false,
    valid2: false,
    rules: {
      required: (value) => (value != null && value != undefined) || '必填项.'
    },
    editedIndex: -1,
    listItem: {}
  }),
  watch: {
    options: {
      handler() {
        this.getList()
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['user']),
    formTitle() {
      return this.editedIndex == -1 ? '添加' : '编辑'
    },
    stepDisabled() {
      if (this.e1 == 1) {
        // 创建账户
        return (
          !this.listItem.firstName ||
          !this.listItem.lastName ||
          !this.listItem.sex ||
          !this.listItem.birthday
        )
      } else if (this.e1 == 2) {
        // 输入公司信息
        return (
          !this.listItem.industry ||
          !this.listItem.businessLicense ||
          !this.listItem.businessLicenseInfo ||
          !this.listItem.companyName ||
          !this.listItem.companyEnglishName ||
          !this.listItem.email ||
          !this.listItem.address ||
          !this.listItem.postcode ||
          !this.listItem.city ||
          !this.listItem.website
        )
      } else if (this.e1 == 3) {
        return true
      }
    }
  },
  methods: {
    async getList() {
      this.loading = true
      const { page, itemsPerPage } = this.options
      const { data, errors } = await this.$altogic.db
        .model('users.facebook_ad_account')
        .sort('updatedAt', 'desc')
        .limit(itemsPerPage)
        .page(page)
        .get({ returnCountInfo: true })

      if (errors) {
        this.$notifier.showMessage({
          content: errors,
          color: 'error'
        })
      } else {
        this.list = data.data
        this.totalCount = data.info.count
      }
      this.loading = false
    },
    async submit() {
      this.loading = true
      if (this.editedIndex > -1) {
        await this.updateItem()
      } else {
        await this.addItem()
      }
      this.loading = false
    },
    closeAdd() {
      this.dialog = false
      this.dialog2 = false
      this.close()
    },
    closeDelete() {
      this.dialogDelete = false
      this.close()
    },
    close() {
      this.$nextTick(() => {
        this.listItem = {}
        this.editedIndex = -1
      })
    },
    async addItem() {
      const data = Object.assign({}, this.listItem)
      const params = this.getPureData(data)
      const { errors } = await this.$altogic.db
        .model('users.facebook_ad_account')
        .object()
        .append(params, this.user._id)
      if (errors) {
        this.$notifier.showMessage({
          content: errors,
          color: 'error'
        })
      } else {
        this.$notifier.showMessage({
          color: 'success',
          content: '添加成功，我们的工作人员马上会处理'
        })
        await this.getList()
        this.closeAdd()
      }
    },
    editItem(item) {
      this.editedIndex = this.list.indexOf(item)
      this.listItem = Object.assign({}, item)
      if (this.listItem.initialCharge) {
        this.dialog2 = true
      } else {
        this.dialog = true
      }
    },
    async deleteItem(item) {
      if (item.length) {
        // 删除多个
        this.listItem = item
        this.dialogDelete = true
      } else {
        this.editedIndex = this.list.indexOf(item)
        if (this.editedIndex > -1) {
          this.listItem = Object.assign({}, item)
          this.dialogDelete = true
        } else {
          this.$notifier.showMessage({
            color: 'error',
            content: '请选择要删除的条目'
          })
        }
      }
    },
    async deleteItemConfirm() {
      if (this.listItem.length) {
        // 删除多个
        for (let item of this.listItem) {
          const { errors } = await this.$altogic.db
            .model('users.facebook_ad_account')
            .object(item._id)
            .delete()
          if (errors) {
            this.$notifier.showMessage({
              content: errors,
              color: 'error'
            })
          }
        }
      } else {
        // 删除单个
        const { errors } = await this.$altogic.db
          .model('users.facebook_ad_account')
          .object(this.listItem._id)
          .delete()
        if (errors) {
          this.$notifier.showMessage({
            content: errors,
            color: 'error'
          })
        }
      }
      await this.getList()
      this.closeDelete()
    },
    async updateItem() {
      const data = Object.assign({}, this.listItem)
      const params = this.getPureData(data)
      const { errors } = await this.$altogic.db
        .model('users.facebook_ad_account')
        .object(params['_id'])
        .update(params)
      if (errors) {
        this.$notifier.showMessage({
          content: errors,
          color: 'error'
        })
      } else {
        await this.getList()
        this.closeAdd()
      }
    },
    uploadFile(which) {
      this.file = null
      this.which = which
      if (which == 'businessLicense') {
        this.accept = 'image/*'
      } else {
        this.accept = '*/*'
      }
      this.$nextTick(() => {
        this.$refs.uploadFile.$refs.input.click()
      })
    },
    async fileChange() {
      if (!this.file) {
        return
      }
      // 上传营业执照
      const { publicPath } = await this.$uploadFile(this.file, 'advertisement')
      this.$set(this.listItem, 'businessLicense', publicPath)
    }
  }
}
</script>
