import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { TadorService } from './tador.service';
import { ReqUser } from '../decorators/user.decorator';
import { App, User } from 'shared/models';
import { ContactNameDirection, Panel } from 'shared/models/tador/panels';
import { AuthorizeInterceptor } from '../middlewares/authorize.middleware';
import { PanelType } from 'shared/models/tador/enum';

@UseInterceptors(AuthorizeInterceptor)
@Controller('tador')
export class TadorController {
    static app = App.tador;
    constructor(private service: TadorService) {}

    @Get('initialData')
    async initialData(@ReqUser() user: User) {
        const panels = await this.service.panelRepo.findMany({ userId: user.email });
        return panels.map(p => {
            const result = { panel: p, dump: new Panel(p).dump() };
            return result;
        });
    }

    @Get('panel/:id')
    async panels(@Param('id') id: string) {
        return this.service.getPanel(id);
    }

    @Post('savePanel')
    async savePanel(@Body() panel: Panel) {
        const p = await this.service.updatePanel(panel);
        const result = { panel: p, dump: new Panel(p).dump() };
        return result;
    }
    @Post('addPanel')
    async addNewPanel(@Body() body: { panelId: string; type: PanelType, direction: ContactNameDirection }, @ReqUser() user: User): Promise<Panel> {
        return this.service.addNewPanel({ panelId: body.panelId, userId: user.email, type: body.type, direction: body.direction });
    }

    @Post('status')
    async status(@Body() panel: Panel): Promise<any> {
        return this.service.addStatus(panel, panel.actionType);
    }

    @Post('removeChanges')
    async removeChanges(@Body() panel: Panel): Promise<Panel> {
        const dump = await this.service.getDump(panel.panelId);
        panel.reDump(dump.dump);
        panel.contacts.changesList = undefined;
        await this.service.panelRepo.saveOrUpdateOne(panel);
        return panel;
    }
}
