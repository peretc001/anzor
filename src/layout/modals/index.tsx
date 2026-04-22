import React from 'react'

import AttachContractorModal from '@/layout/modals/attachContractor'
import AttachCustomerModal from '@/layout/modals/attachCustomer'
import AuthModal from '@/layout/modals/authModal'

const Modals = () => (
  <>
    <AttachCustomerModal />
    <AttachContractorModal />
    <AuthModal />
  </>
)

export default Modals
