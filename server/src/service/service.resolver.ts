import { Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import {
  ServiceCreationInput,
  ServiceUpdateInput,
} from './schemas/service.inputs';
import { Service } from './schemas/service.schema';
import { ServiceService } from './service.service';

@Resolver()
export class ServiceResolver {
  private readonly logger: Logger;
  private pubSub: PubSub;

  constructor(private serviceService: ServiceService) {
    this.logger = new Logger('serviceResolver');
    this.pubSub = new PubSub();
  }

  @Query(() => [Service])
  async getServicesForRouter(
    @Args('routerId') routerId: string,
  ): Promise<Service[]> {
    return await this.serviceService.findByRouter(routerId);
  }

  @Mutation(() => Service)
  async createService(
    @Args('serviceCreationData') serviceCreationData: ServiceCreationInput,
  ): Promise<Service> {
    const service = await this.serviceService.create(serviceCreationData);
    this.logger.log(`Created service with id ${service._id}`);
    this.pubSub.publish('serviceCreated', { serviceCreated: service });
    return service;
  }

  @Mutation(() => Service)
  async updateService(
    @Args('serviceUpdateData') serviceUpdateData: ServiceUpdateInput,
  ): Promise<Service> {
    const service = await this.serviceService.updateById(serviceUpdateData);
    this.logger.log(`Updated service with id ${service._id}`);
    this.pubSub.publish('serviceUpdated', { serviceUpdated: service });
    return service;
  }

  @Mutation(() => Service)
  async deleteService(@Args('serviceId') serviceId: string): Promise<Service> {
    const service = await this.serviceService.deleteById(serviceId);
    this.logger.log(`Deleted service with id ${serviceId}`);
    this.pubSub.publish('serviceDeleted', { serviceDeleted: service });
    return service;
  }

  @Mutation(() => [Service])
  async deleteByRouter(@Args('routerId') routerId: string): Promise<Service[]> {
    return this.serviceService.deleteByRouter(routerId);
  }

  @Subscription(() => Service, {
    filter: ({ serviceCreated }, { routerId }) =>
      serviceCreated.router === routerId,
  })
  serviceCreated(@Args('routerId') routerId: string): AsyncIterator<Service> {
    return this.pubSub.asyncIterator('serviceCreated');
  }

  @Subscription(() => Service, {
    filter: ({ serviceUpdated }, { routerId }) =>
      serviceUpdated.router === routerId,
  })
  serviceUpdated(@Args('routerId') routerId: string): AsyncIterator<Service> {
    return this.pubSub.asyncIterator('serviceUpdated');
  }

  @Subscription(() => Service, {
    filter: ({ serviceDeleted }, { routerId }) =>
      serviceDeleted.router === routerId,
  })
  serviceDeleted(@Args('routerId') routerId: string): AsyncIterator<Service> {
    return this.pubSub.asyncIterator('serviceDeleted');
  }
}
