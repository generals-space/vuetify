<template>
  <v-app>
    <div style="width: 768px;margin: 50px auto;">
      <v-select
        v-model="tags"
        label="标签"
        chips
        tags
        required
      ></v-select>

      <v-editor
        uploadURL="/blogs/Vanessa/upload"
        :uploadMax="10"
        :value="text"
        :height="300"
        :label="label"
        :fetchUpload="fetchUpload"
        @change="update"></v-editor>
      <v-carousel
        :cycle="false"
        icon="circle"
        left-control-icon="angle-left"
        right-control-icon="angle-right">
        <v-carousel-item v-for="(item,i) in thumbs" v-bind:src="item" :key="i"></v-carousel-item>
      </v-carousel>
    </div>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      thumbs: ['https://img.hacpai.com/bing/20171202.jpg?imageView2/1/w/768/h/180/interlace/1/q/100',
        'https://img.hacpai.com/bing/20171202.jpg?imageView2/1/w/768/h/180/interlace/1/q/100',
        'https://img.hacpai.com/bing/20171202.jpg?imageView2/1/w/768/h/180/interlace/1/q/100',
        'https://img.hacpai.com/bing/20171202.jpg?imageView2/1/w/768/h/180/interlace/1/q/100',
        'https://img.hacpai.com/bing/20171202.jpg?imageView2/1/w/768/h/180/interlace/1/q/100',
        'https://img.hacpai.com/bing/20171202.jpg?imageView2/1/w/768/h/180/interlace/1/q/100'],
      text: 'pipe editor',
      tags: [],
      label: {
        loading: '',
        over: '',
        error: '',
        emoji:' <ctrl+/>',
        bold: '',
        italic: '',
        quote: '',
        link: '',
        upload: '',
        unorderedList: '',
        orderedList: '',
        preview: '',
        fullscreen: '',
        help: ''
      }
    }),
    methods: {
      fetchUpload (src, succCB) {
        setTimeout(() => {
          succCB(src, 'vvvvvvv')
        }, 1000)
      },
      update () {
        console.log('input', arguments)
      }
    },
    mounted () {
      this.$set(this, 'thumbs', ["https://img.hacpai.com/bing/20171202.jpg?imageView2/1/w/768/h/180/interlace/1/q/100","https://img.hacpai.com/bing/20171123.jpg?imageView2/1/w/768/h/180/interlace/1/q/100","https://img.hacpai.com/bing/20171121.jpg?imageView2/1/w/768/h/180/interlace/1/q/100","https://img.hacpai.com/bing/20171108.jpg?imageView2/1/w/768/h/180/interlace/1/q/100","https://img.hacpai.com/bing/20171207.jpg?imageView2/1/w/768/h/180/interlace/1/q/100"])
    }
  }
</script>

<style lang="stylus">
  .pipe-tooltipped {
    position: relative;
    cursor: pointer;

  &::after {
     position: absolute;
     z-index: 1000;
     display: none;
     padding: 5px 8px;
     font-size: 11px;
     font-weight: normal;
     color: #fff;
     text-align: center;
     text-decoration: none;
     text-shadow: none;
     text-transform: none;
     letter-spacing: normal;
     word-wrap: break-word;
     white-space: pre;
     pointer-events: none;
     content: attr(aria-label);
     background: rgba(0, 0, 0, 0.8);
     border-radius: 3px;
     line-height: 16px;
     opacity: 0
   }

  &::before {
     position: absolute;
     z-index: 1000001;
     display: none;
     width: 0;
     height: 0;
     color: rgba(0, 0, 0, 0.8);
     pointer-events: none;
     content: "";
     border: 5px solid transparent;
     opacity: 0
   }

  @keyframes tooltip-appear {
    from {
      opacity: 0
    }

    to {
      opacity: 1
    }
  }

  &:hover::before,
  &:hover::after,
  &:active::before,
  &:active::after,
  &:focus::before,
  &:focus::after {
     display: inline-block;
     text-decoration: none;
     animation-name: tooltip-appear;
     animation-duration: 0.1s;
     animation-fill-mode: forwards;
     animation-timing-function: ease-in;
     animation-delay: 0.4s
   }

  &--s::after,
  &--se::after,
  &--sw::after {
     top: 100%;
     right: 50%;
     margin-top: 5px
   }

  &--s::before,
  &--se::before,
  &--sw::before {
     top: auto;
     right: 50%;
     bottom: -5px;
     margin-right: -5px;
     border-bottom-color: rgba(0, 0, 0, 0.8)
   }

  &--se::after {
     right: auto;
     left: 50%;
     margin-left: -15px
   }

  &--sw::after {
     margin-right: -15px
   }

  &--n::after,
  &--ne::after,
  &--nw::after {
     right: 50%;
     bottom: 100%;
     margin-bottom: 5px
   }

  &--n::before,
  &--ne::before,
  &--nw::before {
     top: -5px;
     right: 50%;
     bottom: auto;
     margin-right: -5px;
     border-top-color: rgba(0, 0, 0, 0.8)
   }

  &--ne::after {
     right: auto;
     left: 50%;
     margin-left: -15px
   }

  &--nw::after {
     margin-right: -15px
   }

  &--s::after,
  &--n::after {
     transform: translateX(50%)
   }

  &--w::after {
     right: 100%;
     bottom: 50%;
     margin-right: 5px;
     transform: translateY(50%);
   }

  &--w::before {
     top: 50%;
     bottom: 50%;
     left: -5px;
     margin-top: -5px;
     border-left-color: rgba(0, 0, 0, 0.8);
   }

  &--e::after {
     bottom: 50%;
     left: 100%;
     margin-left: 5px;
     transform: translateY(50%)
   }

  &--e::before {
     top: 50%;
     right: -5px;
     bottom: 50%;
     margin-top: -5px;
     border-right-color: rgba(0, 0, 0, 0.8)
   }
  }
</style>
