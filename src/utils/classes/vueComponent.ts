import {Vue} from 'vue-property-decorator';

export class VueComponent<T> extends Vue {
    public $props!: T
}