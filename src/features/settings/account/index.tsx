import ContentSection from '../components/content-section'
import { AccountForm } from './account-form'

export default function SettingsAccount() {
  return (
    <ContentSection
      title='Tài khoản'
      desc='Cập nhật cài đặt tài khoản. Thiết lập ngôn ngữ và múi giờ ưa thích của bạn.'
    >
      <AccountForm />
    </ContentSection>
  )
}
