import Vue from 'vue/dist/vue.esm';

$(document).on("turbolinks:load", function(){
  new Vue({
    el: '#list-items',
    data: function () {
      return {
        fields: [
          'id',
          {
            key: 'title',
            formatter: (value) => { return value.substring(0,30); }
          },
          'actions'
        ],
        items: [],
        currentPage: 0,
        pages: 0,
        total_pages: 0,
        perPage: 0,
        total: 0,
        from: 0,
        to: 0,
        search: ""
      }
    },
    mounted: function () {
      var element = $(this.$el);

      this.fetch($(element).attr('api-url'));
    },
    methods: {
      fetch(url){
        this.$http
          .get(url)
          .then(response => {
            this.items = response.data.data;
            this.currentPage = response.data.current_page;
            this.pages = response.data.total_pages;
            this.perPage = response.data.per_page;
            this.total_pages = response.data.total_pages;
            this.total = response.data.total;
            this.from = response.data.from;
            this.to = response.data.to;
          });
      },
      showListItem(listItem) {
        Turbolinks.visit(listItem.item.url);
      },
      editListItem(listItem) {
        Turbolinks.visit(listItem.item.edit_url);
      },
      deleteListItem(listItem) {
        this.$http.delete(listItem.item.url)
        .then((response) => {
          console.log(response);
        });
      },
      // linkGenerator(pageNum) {
      //   return {
      //     path: `/vue/list_items?page=${pageNum}&per_page=${this.perPage}&search=${this.search}`
      //   }
      // },
      onPageChange(page){
        this.fetch(`/vue/list_items.json?page=${page}&per_page=${this.perPage}&search=${this.search}`);
      },
      doSearch(){
        var url = `/vue/list_items.json?page=${this.currentPage}&per_page=${this.perPage}&search=${this.search}`
        this.fetch(url);
      }
    }
  });
});