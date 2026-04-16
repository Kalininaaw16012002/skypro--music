import { formatTime } from "./helper"

describe('formatTime', () => {
    it('Добавление нуля, если секунд < 10', () => {
        expect(formatTime(61)).toBe('1:01');
    })
})