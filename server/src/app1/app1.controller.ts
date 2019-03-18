import { Controller, Post, Get } from '@nestjs/common';
import { CheckboxFilter, DropdownFilter, Filter } from 'shared';
@Controller('rest/mf')
export class App1Controller {
    @Get('')
    async getInitialData(): Promise<Filter[]> {
        const filter1 =
            new CheckboxFilter({ options: [{ _id: '1', name: 'name1' }, { _id: '2', name: 'name2' }], selected: { _id: '2', name: 'name2' } });

        const filter2 =
            new DropdownFilter({ options: [{ _id: '1', name: 'name1' }, { _id: '2', name: 'name2' }], selected: { _id: '2', name: 'name2' } });
        return [filter1, filter2];
    }
    @Get('funds')
    async getFunds(): Promise<any> {
        return require('./funds.json');
    }
}
