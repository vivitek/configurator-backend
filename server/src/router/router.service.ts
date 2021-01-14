import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Router } from './schemas/router.schema';
import { Model } from 'mongoose';
import {
  RouterCreationInput,
  RouterUpdateInput,
} from './schemas/router.inputs';

@Injectable()
export class RouterService {
  constructor(@InjectModel(Router.name) private routerModel: Model<Router>) {}

  async findAll(): Promise<Router[]> {
    return (await this.routerModel.find().exec()).map(d => d);
  }

  async findById(id: string): Promise<Router> {
    return await this.routerModel.findById(id).exec();
  }

  async findByUrl(url: string): Promise<Router> {
    return await this.routerModel.findOne({ url }).exec();
  }

  async create(content: RouterCreationInput): Promise<Router> {
    const router = new this.routerModel(content);
    return router.save();
  }

  async deleteById(id: string): Promise<Router> {
    return await this.routerModel.findByIdAndDelete(id);
  }

  async updateById(content: RouterUpdateInput): Promise<Router> {
    return this.routerModel
      .findOneAndUpdate({ _id: content.id }, content)
      .exec();
  }

  async deleteAll() /*: Promise<Array<Router>> */ {
    if (!process.env.DEBUG) return;
    return this.routerModel.db.dropDatabase();
  }
}
