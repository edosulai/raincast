import colorLib from '@kurkle/color'
import 'chartjs-adapter-luxon'

import { createApp, nextTick } from 'vue/dist/vue.esm-browser'
import VueClickAway from "vue3-click-away"
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
} from 'chart.js'

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
)

const LOADING = `
  <div class="flex w-20 justify-between mx-auto">
    <span class="flex h-3 w-3 relative">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
    </span>
    <span class="flex h-3 w-3 relative">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
    </span>
    <span class="flex h-3 w-3 relative">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
    </span>
  </div>
`

const transparentize = function (value, opacity) {
  let alpha = opacity === undefined ? 0.5 : 1 - opacity
  return colorLib(value).alpha(alpha).rgbString()
}

const SelectMultiple = createApp({
  data() {
    return {
      options: [],
      selecteds: [],
      show: false,
    }
  },
  mounted() {
    this.selectTag = this.$el.parentElement.querySelector('select')
    for (let i = 0; i < this.selectTag.options.length; i++) {
      this.options.push({
        value: this.selectTag.options[i].value,
        text: this.selectTag.options[i].innerText,
        // selected: this.selectTag.options[i].value == 'rr' ? true : false
        selected: false
      })

      if (this.selectTag.options[i].value == 'rr') {
        // this.selectTag.options[i].setAttribute('selected', 'selected')
        this.setSelected(i)
      }
    }
  },
  methods: {
    onClickAway() {
      if (this.show) this.show = false
    },
    setSelected(index, event = null) {
      if (!this.options[index].selected) {
        this.selectTag.options[index].setAttribute('selected', 'selected')
        this.options[index].selected = true
        if (event) {
          this.options[index].element = event.target
        }
        this.selecteds.push(index)
      } else {
        this.selectTag.options[index].removeAttribute('selected')
        this.selecteds.splice(this.selecteds.lastIndexOf(index), 1)
        this.options[index].selected = false
      }
    },
    removeSelected(index, option) {
      this.selectTag.options[option].removeAttribute('selected')
      this.options[option].selected = false
      this.selecteds.splice(index, 1)
    },
    selectedValues() {
      return this.selecteds.map((option) => {
        return this.options[option].value
      })
    }
  }
}).use(VueClickAway)
if (document.querySelector('.select-multiple')) SelectMultiple.mount('.select-multiple')

const SwitchTheme = createApp({
  data() {
    return {
      isDark: localStorage.getItem('theme') === 'dark' ? true : false
    }
  },
  methods: {
    switcher(event = null) {
      localStorage.theme = typeof event == 'string' ? event : event != null && event.target.checked ? 'dark' : 'light'
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        this.isDark = true
        document.documentElement.classList.add('dark')
      } else {
        this.isDark = false
        document.documentElement.classList.remove('dark')
      }
    }
  },
  mounted() {
    return this.switcher(localStorage.getItem('theme'))
  }
})
if (document.querySelector('#switch-theme')) SwitchTheme.mount('#switch-theme')

const DropdownTrigger = createApp({
  data() {
    return {
      open: false
    }
  },
  methods: {
    onClickAway() {
      if (this.open) {
        this.open = false
      }
    }
  }
}).use(VueClickAway)
if (document.querySelector('.dropdown-trigger')) DropdownTrigger.mount('.dropdown-trigger')

const Klimatologi = createApp({
  delimiters: ['[[', ']]'],
  data() {
    return {
      klimatologi: {},
      modal_open: false,
      id_to_delete: null,
      prevent_close: false,
    }
  },
  methods: {
    onClickAway() {
      if (this.modal_open && !this.prevent_close) {
        this.modal_open = false
        document.documentElement.style.overflow = 'auto'
      }
      this.prevent_close = false
    },
    modalVisible(event, id, prevent_close) {
      this.modal_open = !this.modal_open
      if (this.modal_open) {
        document.documentElement.style.overflow = 'hidden'
      } else {
        document.documentElement.style.overflow = 'auto'
      }
      this.id_to_delete = id
      this.prevent_close = prevent_close
    },
    redirectToEdit(event, id) {
      window.location.replace(`/klimatologi/${id}/`)
    },
    deleteRow(id) {
      fetch(`/api/klimatologi/${id}/`, {
        method: 'DELETE',
        headers: {
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
      }).then(response => {
        this.modal_open = false
        document.documentElement.style.overflow = 'auto'
        this.klimatologi.ajax.reload()
      }).catch((jqXHR, textStatus, errorThrown) => console.log(errorThrown))
    }
  },
  created() {
    if (!window.redirectToEdit) window.redirectToEdit = this.redirectToEdit
    if (!window.modalVisible) window.modalVisible = this.modalVisible
  },
  mounted() {
    this.klimatologi = $('#klimatologi_table').DataTable({
      processing: true,
      serverSide: true,
      language: {
        processing: LOADING
      },
      ajax: {
        url: "/api/klimatologi/",
        type: "GET",
      },
      columnDefs: [{
        targets: 12,
        orderable: false,
        data: "id",
        render: function (id, type, row, meta) {
          return (`
            <span class="flex">
              <button onclick="redirectToEdit(event, ${id})" class="edit-klimatologi flex items-center px-2 py-1 mx-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                </svg>
              </button>
              <button onclick="modalVisible(event, ${id}, true)" class="flex items-center px-2 py-1 mx-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </span>
          `)
        }
      }],
      columns: [{
        data: "id"
      }, {
        data: "tanggal"
      }, {
        data: "tn"
      }, {
        data: "tx"
      }, {
        data: "tavg"
      }, {
        data: "rh_avg"
      }, {
        data: "rr"
      }, {
        data: "ss"
      }, {
        data: "ff_x"
      }, {
        data: "ddd_x"
      }, {
        data: "ff_avg"
      }, {
        data: "ddd_car"
      }]
    })
  }
}).use(VueClickAway)
if (document.querySelector('#klimatologi')) Klimatologi.mount('#klimatologi')

const Proyeksi = createApp({
  delimiters: ['[[', ']]'],
  data() {
    return {
      proyeksi: {},
      modal_open: false,
      id_to_delete: null,
      prevent_close: false,
    }
  },
  methods: {
    onClickAway() {
      if (this.modal_open && !this.prevent_close) {
        this.modal_open = false
        document.documentElement.style.overflow = 'auto'
      }
      this.prevent_close = false
    },
    modalVisible(event, id, prevent_close) {
      this.modal_open = !this.modal_open
      if (this.modal_open) {
        document.documentElement.style.overflow = 'hidden'
      } else {
        document.documentElement.style.overflow = 'auto'
      }
      this.id_to_delete = id
      this.prevent_close = prevent_close
    },
    redirectToDetail(event, id) {
      window.location.replace(`/proyeksi/${id}/`)
    },
    deleteRow(id) {
      fetch(`/api/proyeksi/${id}/`, {
        method: 'DELETE',
        headers: {
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
      }).then(response => {
        this.modal_open = false
        document.documentElement.style.overflow = 'auto'
        this.proyeksi.ajax.reload()
      }).catch((jqXHR, textStatus, errorThrown) => console.log(errorThrown))
    }
  },
  created() {
    if (!window.redirectToDetail) window.redirectToDetail = this.redirectToDetail
    if (!window.modalVisible) window.modalVisible = this.modalVisible
  },
  mounted() {
    this.proyeksi = $('#proyeksi_table').DataTable({
      processing: true,
      serverSide: true,
      language: {
        processing: LOADING
      },
      ajax: {
        url: "/api/proyeksi/",
        type: "GET",
      },
      columnDefs: [{
        targets: 13,
        orderable: false,
        data: "id",
        render: function (id, type, row, meta) {
          return (`
            <span class="flex">
              <button onclick="redirectToDetail(event, ${id})" class="edit-proyeksi flex items-center px-2 py-1 mx-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2h-1.528A6 6 0 004 9.528V4z" />
                  <path fill-rule="evenodd" d="M8 10a4 4 0 00-3.446 6.032l-1.261 1.26a1 1 0 101.414 1.415l1.261-1.261A4 4 0 108 10zm-2 4a2 2 0 114 0 2 2 0 01-4 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button onclick="modalVisible(event, ${id}, true)" class="flex items-center px-2 py-1 mx-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </span>
          `)
        }
      }, {
        targets: 12,
        render: function (data, type, row) {
          return data.toFixed(2)
        }
      }],
      columns: [{
        data: "id"
      }, {
        data: "timestep"
      }, {
        data: "max_batch_size"
      }, {
        data: "max_epoch"
      }, {
        data: "layer_size"
      }, {
        data: "unit_size"
      }, {
        data: "dropout"
      }, {
        data: "learning_rate"
      }, {
        data: "row_start"
      }, {
        data: "row_end"
      }, {
        data: "feature_training"
      }, {
        data: "feature_predict"
      }, {
        data: "loss"
      }]
    })
  }
}).use(VueClickAway)
if (document.querySelector('#proyeksi')) Proyeksi.mount('#proyeksi')

const PredictionResult = createApp({
  delimiters: ['[[', ']]'],
  data() {
    return {
      connection: new WebSocket('ws://' + window.location.host + '/ws/proyeksi/'),
      terminal: "...\n",
      hyperparameters: {}
    }
  },
  created() {
    this.predictChart = new Chart(document.getElementById('predict-chart'), {
      type: 'line',
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Prediksi dan Histori Data'
          },
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Timeline'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Tingkat Nilai Data'
            },
          }
        },
      },
    })

    this.errorChart = new Chart(document.getElementById('error-chart'), {
      type: 'line',
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Error Tiap Epoch'
          },
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Epoch'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Tingkat Nilai Error'
            },
          }
        },
      },
    })

    this.evaChart = new Chart(document.getElementById('eva-chart'), {
      type: 'line',
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Error Tiap Iterasi Testing'
          },
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Iterasi'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Tingkat Nilai Error'
            },
          }
        },
      },
    })
  },
  mounted() {

    for (const form of document.getElementsByClassName('proyeksi-form')) {
      this.hyperparameters[form.id] = form.innerHTML
    }

    $.fn.dataTable.moment('DD/MM/YY')

    this.tablehistory = $('#history').DataTable({
      processing: true,
      language: {
        zeroRecords: LOADING
      },
      columns: [{
        data: "tanggal"
      }, ...this.hyperparameters['feature_training'].split(",").map(x => ({ data: x }))],
      searching: false,
    })

    this.tableproyeksi = $('#proyeksi').DataTable({
      processing: true,
      language: {
        zeroRecords: LOADING
      },
      columns: ((hyperparameters) => {
        let columns = [
          {
            data: "tanggal"
          }, {
            data: hyperparameters['feature_predict']
          }
        ]

        if (hyperparameters['feature_predict'] == 'rr') {
          columns.push({
            data: 'intensitas'
          })
        }

        return columns
      })(this.hyperparameters),
      searching: false,
    })

    this.waitForConnection = (callback, interval) => {
      if (this.connection.readyState === 1) {
        callback()
      } else {
        setTimeout(() => {
          this.waitForConnection(callback, interval)
        }, interval)
      }
    }

    this.sendMessage = (message, callback) => {
      this.waitForConnection(() => {
        this.connection.send(message)
        if (typeof callback !== 'undefined') {
          callback()
        }
      }, 1000)
    }

    this.connection.onmessage = (event) => {

      let data = JSON.parse(event.data)
      if (data.message) {
        let terminalElem = document.querySelector("pre")
        let newstring = `${this.terminal}${data.message}`
        let matchstring = newstring.match("\n\.*\r")
        terminalElem.scrollTop = terminalElem.scrollHeight
        if (matchstring != null) {
          this.terminal = newstring.replace(matchstring[0], '\n')
          terminalElem.scrollTop = terminalElem.scrollHeight
        } else {
          this.terminal = newstring
          terminalElem.scrollTop = terminalElem.scrollHeight
        }
      }

      const CHART_COLORS = [
        'rgb(54, 162, 235)', //blue
        'rgb(153, 102, 255)',//purple
        'rgb(75, 192, 192)', //green
        'rgb(255, 159, 64)', //orange
        'rgb(255, 205, 86)', //yellow
        'rgb(255, 99, 132)', //red
        'rgb(201, 203, 207)',//grey
        'rgb(255, 29, 194)', //violet
        'rgb(10, 205, 222)', //cyan
        'rgb(47, 130, 255)', //sea
        'rgb(125, 125, 125)',//middle
      ]

      if (data.results) {

        this.predictChart.data = {
          labels: data.labels,
          datasets: [
            ...data.results.history.map((history, i) => {
              // const color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`
              return {
                label: `History - ${history.nama}`,
                data: history.hasil.map(x => x.nilai),
                borderColor: CHART_COLORS[i],
                backgroundColor: transparentize(CHART_COLORS[i], 0.5),
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.3
              }
            }),
            {
              label: `Proyeksi - ${data.results.prediction.nama}`,
              data: data.historylabels.map(() => null).concat(data.results.prediction.hasil.map(x => x.nilai)),
              borderColor: CHART_COLORS[CHART_COLORS.length - 1],
              backgroundColor: transparentize(CHART_COLORS[CHART_COLORS.length - 1], 0.5),
              fill: false,
              cubicInterpolationMode: 'monotone',
              tension: 0.4
            }
          ]
        }

        this.predictChart.update()

        this.tablehistory.rows.add(data.historylabels.map((label) => {
          let tabeldata = {
            tanggal: label
          }

          for (const feature of this.hyperparameters['feature_training'].split(",")) {
            let eachHistory = data.results.history.filter(x => x.nama == feature)[0]
            let nilai = eachHistory.hasil.filter(x => x.tanggal == label)[0].nilai
            tabeldata[feature] = typeof nilai != 'string' ? nilai.toFixed(2) : nilai
          }

          return tabeldata
        })).draw()

        this.tableproyeksi.rows.add(data.results.prediction.hasil.map(x => {
          let tabeldata = {
            tanggal: x.tanggal
          }

          tabeldata[data.results.prediction.nama] = typeof x.nilai != 'string' ? x.nilai.toFixed(2) : x.nilai

          if (data.results.prediction.nama == 'rr') {
            tabeldata['intensitas'] =
              x.nilai == 0 ? 'Berawan' :
                x.nilai >= 0.5 && x.nilai <= 20 ? 'Hujan ringan' :
                  x.nilai >= 20 && x.nilai <= 50 ? 'Hujan sedang' :
                    x.nilai >= 50 && x.nilai <= 100 ? 'Hujan lebat' :
                      x.nilai >= 100 && x.nilai <= 150 ? 'Hujan sangat lebat' : 'Hujan ekstrem'
          }

          return tabeldata
        })).draw()

        this.errorChart.data = {
          labels: data.loss_trains.map((x, i) => `Epoch ${i + 1}`),
          datasets: [
            {
              label: `Error`,
              data: data.loss_trains,
              borderColor: CHART_COLORS[5],
              backgroundColor: transparentize(CHART_COLORS[5], 0.5),
              fill: false,
              cubicInterpolationMode: 'monotone',
              tension: 0.4
            }
          ]
        }

        this.errorChart.update()

        this.evaChart.data = {
          labels: data.loss_tests.map((x, i) => `Iterasi ${i + 1}`),
          datasets: [
            {
              label: `Error`,
              data: data.loss_tests,
              borderColor: CHART_COLORS[5],
              backgroundColor: transparentize(CHART_COLORS[5], 0.5),
              fill: false,
              cubicInterpolationMode: 'monotone',
              tension: 0.4
            }
          ]
        }

        this.evaChart.update()

        document.getElementById('penegas').innerHTML = `
          <p>
            Dari Hasil nilai error di atas di dapat nilai rata-rata dari seluruh MSE (Mean Square Error) sebesar <b>${data.eva_error.toFixed(4)}</b>.
          </p>
          <p>
            Nilai tersebut memiliki arti bahwa proyeksi feature <b>(${data.results.prediction.nama})</b> pada saat testing memiliki tingkat ketidakakuratan lebih kurang sebesar <b>${data.eva_error.toFixed(4)}</b> dalam memproyeksi feature <b>(${data.results.prediction.nama})</b>.
          </p>
        `
      }

    }

    this.sendMessage(JSON.stringify(this.hyperparameters))
  }
})
if (document.querySelector('#prediction-result')) PredictionResult.mount('#prediction-result')