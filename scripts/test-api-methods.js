const fetch = require('node-fetch')

const BASE_URL = 'http://localhost:3002'

async function testDepartmentAPIs() {
  console.log('🧪 Testing Department APIs...\n')
  
  try {
    // 1. Test GET departments
    console.log('1. Testing GET /api/departments')
    const getResponse = await fetch(`${BASE_URL}/api/departments`)
    const departments = await getResponse.json()
    console.log('✅ GET Success:', departments.success)
    console.log('📊 Departments count:', departments.data?.length || 0)
    
    if (departments.data && departments.data.length > 0) {
      const testDept = departments.data[0]
      console.log('🎯 Test department:', testDept.ten_phong_ban)
      
      // 2. Test PUT department (update)
      console.log('\n2. Testing PUT /api/departments (update)')
      const updateData = {
        ...testDept,
        mo_ta: `Updated at ${new Date().toISOString()}`
      }
      
      const putResponse = await fetch(`${BASE_URL}/api/departments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      
      const updateResult = await putResponse.json()
      console.log('✅ PUT Success:', updateResult.success)
      console.log('📝 Updated description:', updateResult.data?.mo_ta)
      
      // 3. Test status toggle
      console.log('\n3. Testing status toggle')
      const newStatus = testDept.trang_thai === 'active' ? 'inactive' : 'active'
      const toggleData = {
        ...testDept,
        trang_thai: newStatus
      }
      
      const toggleResponse = await fetch(`${BASE_URL}/api/departments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toggleData)
      })
      
      const toggleResult = await toggleResponse.json()
      console.log('✅ Toggle Success:', toggleResult.success)
      console.log('🔄 New status:', toggleResult.data?.trang_thai)
      
      // 4. Toggle back to original status
      console.log('\n4. Reverting status')
      const revertData = {
        ...testDept,
        trang_thai: testDept.trang_thai
      }
      
      const revertResponse = await fetch(`${BASE_URL}/api/departments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(revertData)
      })
      
      const revertResult = await revertResponse.json()
      console.log('✅ Revert Success:', revertResult.success)
      console.log('🔄 Reverted status:', revertResult.data?.trang_thai)
    }
    
  } catch (error) {
    console.error('❌ Department API Test Error:', error.message)
  }
}

async function testUserAPIs() {
  console.log('\n\n👥 Testing User APIs...\n')
  
  try {
    // 1. Test GET users
    console.log('1. Testing GET /api/users')
    const getResponse = await fetch(`${BASE_URL}/api/users`)
    const users = await getResponse.json()
    console.log('✅ GET Success:', users.success)
    console.log('👤 Users count:', users.data?.length || 0)
    
    if (users.data && users.data.length > 0) {
      const testUser = users.data.find(u => u.id !== 'USER_001') || users.data[0] // Avoid admin user
      console.log('🎯 Test user:', testUser.ho_ten)
      
      // 2. Test PUT user (update)
      console.log('\n2. Testing PUT /api/users (update)')
      const updateData = {
        ...testUser,
        mo_ta: `Updated at ${new Date().toISOString()}`
      }
      
      const putResponse = await fetch(`${BASE_URL}/api/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      
      const updateResult = await putResponse.json()
      console.log('✅ PUT Success:', updateResult.success)
      console.log('📝 Updated user:', updateResult.data?.ho_ten)
      
      // 3. Test status toggle
      console.log('\n3. Testing user status toggle')
      const newStatus = testUser.trang_thai === 'active' ? 'inactive' : 'active'
      const toggleData = {
        ...testUser,
        trang_thai: newStatus
      }
      
      const toggleResponse = await fetch(`${BASE_URL}/api/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toggleData)
      })
      
      const toggleResult = await toggleResponse.json()
      console.log('✅ Toggle Success:', toggleResult.success)
      console.log('🔄 New status:', toggleResult.data?.trang_thai)
      
      // 4. Toggle back to original status
      console.log('\n4. Reverting user status')
      const revertData = {
        ...testUser,
        trang_thai: testUser.trang_thai
      }
      
      const revertResponse = await fetch(`${BASE_URL}/api/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(revertData)
      })
      
      const revertResult = await revertResponse.json()
      console.log('✅ Revert Success:', revertResult.success)
      console.log('🔄 Reverted status:', revertResult.data?.trang_thai)
    }
    
  } catch (error) {
    console.error('❌ User API Test Error:', error.message)
  }
}

async function runTests() {
  console.log('🚀 Starting API Methods Test\n')
  console.log('=' .repeat(50))
  
  await testDepartmentAPIs()
  await testUserAPIs()
  
  console.log('\n' + '='.repeat(50))
  console.log('✅ API Methods Test Completed!')
}

// Run tests
runTests().catch(console.error)