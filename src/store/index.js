import { createStore } from 'vuex'

export default createStore({
  state: {
    results: {
      selfie: { image: null, debug: {} },
      passportMain: { image: null, debug: {} },
      passportRegistration: { image: null, debug: {} }
    },
    cameraStream: null,
    currentFacingMode: 'user',
    hasMultipleCameras: false
  },
  mutations: {
    SET_RESULT(state, { step, data }) {
      state.results[step] = data
    },
    SET_CAMERA_STREAM(state, stream) {
      // Останавливаем предыдущий поток
      if (state.cameraStream) {
        state.cameraStream.getTracks().forEach(track => track.stop())
      }
      state.cameraStream = stream
    },
    SET_FACING_MODE(state, mode) {
      state.currentFacingMode = mode
    },
    SET_MULTIPLE_CAMERAS(state, hasMultiple) {
      state.hasMultipleCameras = hasMultiple
    },
    CLEAR_STORAGE(state) {
      state.results = {
        selfie: { image: null, debug: {} },
        passportMain: { image: null, debug: {} },
        passportRegistration: { image: null, debug: {} }
      }
      state.cameraStream = null
      state.currentFacingMode = 'user'
    },
    LOAD_FROM_STORAGE(state) {
      try {
        const data = localStorage.getItem('verification_results')
        if (data) {
          state.results = JSON.parse(data)
        }
      } catch (e) {
        console.error('Storage load error:', e)
      }
    }
  },
  actions: {
    async checkCameraDevices({ commit }) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        commit('SET_MULTIPLE_CAMERAS', videoDevices.length > 1)
        return videoDevices.length > 1
      } catch (error) {
        console.error('Error checking camera devices:', error)
        return false
      }
    },
    saveResult({ commit, state }, { step, data }) {
      commit('SET_RESULT', { step, data })
      
      try {
        localStorage.setItem('verification_results', JSON.stringify(state.results))
      } catch (e) {
        console.error('Storage save error:', e)
      }
    },
    async requestCamera({ commit, state }, facingMode) {
      try {
        // Останавливаем предыдущую камеру
        if (state.cameraStream) {
          state.cameraStream.getTracks().forEach(track => track.stop())
        }

        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        commit('SET_CAMERA_STREAM', stream)
        commit('SET_FACING_MODE', facingMode)
        return stream
      } catch (error) {
        console.error('Camera request error:', error)
        commit('SET_CAMERA_STREAM', null)
        throw error
      }
    },
    stopCamera({ state }) {
      if (state.cameraStream) {
        state.cameraStream.getTracks().forEach(track => {
          track.stop()
        })
      }
    },
    loadFromStorage({ commit }) {
      commit('LOAD_FROM_STORAGE')
    }
  },
  getters: {
    allResultsCaptured: (state) => {
      return state.results.selfie.image && 
             state.results.passportMain.image && 
             state.results.passportRegistration.image
    }
  }
})