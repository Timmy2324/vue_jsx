import { Component, Prop, Ref } from 'vue-property-decorator';
import { VNode } from 'vue';
import { VueComponent } from '@/utils/classes/vueComponent';

interface Props<T> {
    totalHeight: number
    rowHeight: number
    maxRow: number
    count: number
    items: T[]
    rowTemplate: (item: T) => VNode
    endScroll: () => void
}

@Component
export class VirtualScroll<T> extends VueComponent<Props<T>> {
    @Ref() readonly wrapper?: HTMLElement
    @Ref() readonly viewport?: HTMLElement
    @Ref() readonly elements?: HTMLElement

    @Prop() readonly totalHeight!: Props<T>['totalHeight']
    @Prop() readonly rowHeight!: Props<T>['rowHeight']
    @Prop() readonly maxRow!: Props<T>['maxRow']
    @Prop() readonly count!: Props<T>['count']
    @Prop() readonly items!: Props<T>['items']
    @Prop() readonly rowTemplate!: Props<T>['rowTemplate']
    @Prop() readonly endScroll!: Props<T>['endScroll']

    private scrollTop = 0
    private heightDifference = 0

    mounted() {
        // отслеживаем событие прокрутки таблицы
        this.wrapper?.addEventListener('scroll', this.handleScroll)
        this.calculateDifferenceHeight()
    }

    destroyed() {
        // прекращаем отслеживать событие прокрутки таблицы
        this.wrapper?.removeEventListener('scroll', this.handleScroll)
    }

    // реальная высота области, которую скролим
    get viewportHeight() {
        return this.rowHeight * this.count + this.heightDifference
    }

    get startIndex() {
        return Math.floor(this.scrollTop / this.rowHeight)
    }

    // список видимых элементов
    get visibleItems() {
        return this.items.slice(this.startIndex, this.startIndex + this.maxRow) || []
    }

    // отступ для области которую скролим
    get offsetY() {
        return this.startIndex * this.rowHeight
    }

    get elementsStyle() {
        return `transform: translateY(${this.offsetY}px)`
    }

    get viewportStyle() {
        return `overflow: hidden; position: relative; height: ${this.viewportHeight}px`
    }

    get wrapperStyle() {
        const count = this.count > this.maxRow ? this.maxRow : this.count

        return `height: calc(${count * this.rowHeight}px); overflow: auto`
    }

    private handleScroll() {
        const scrollTop = this.wrapper?.scrollTop || 0
        const maxOffset = this.rowHeight * (this.count - this.maxRow) + this.heightDifference

        if (scrollTop > maxOffset) {
            return
        }

        if (scrollTop === maxOffset) {
            this.endScroll()
        }

        this.scrollTop = scrollTop

        this.calculateDifferenceHeight()

    }

    // расчитываем разницу между реальной и предполагаемой (по переданным размера) высотой всех элементов
    // на случай, если реальная высота элемента не соответствует указаной в пропсах
    private calculateDifferenceHeight() {
        const children = this.elements?.children || {}
        const currentHeight = Object.values<HTMLElement>(children).reduce<number>((acc, cur) => acc + cur.offsetHeight, 0)

        // 5 - for smoothing
        this.heightDifference = currentHeight - this.visibleItems.length * this.rowHeight + 5
    }

    render(): VNode {
        return (
            <div
                ref={'wrapper'}
                style={this.wrapperStyle}
            >
                <div
                    ref={'viewport'}
                    style={this.viewportStyle}
                >
                    <div
                        ref={'elements'}
                        style={this.elementsStyle}
                    >
                        {this.visibleItems.map((item) => this.rowTemplate(item))}
                    </div>
                </div>
            </div>
        )
    }
}